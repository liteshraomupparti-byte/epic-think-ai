/**
 * Epic Think AI - User Profile, Account & Personalization API Routes
 * 
 * Provides:
 * - GET    /api/user/profile          - Get canonical user profile (auto-backfills if needed)
 * - PATCH  /api/user/profile          - Update profile attributes (sanitized, allowlisted)
 * - POST   /api/user/profile/avatar   - Real profile photo upload with validation & disk persistence
 * - DELETE /api/user/profile/avatar   - Remove avatar photo
 * - GET    /api/user/preferences      - Get user UI & engine preferences
 * - PATCH  /api/user/preferences      - Update user UI & engine preferences
 * - GET    /api/user/personalization  - Get user AI personalization context & custom instructions
 * - PATCH  /api/user/personalization  - Update AI personalization context & custom instructions
 * - POST   /api/user/username/check   - Check unique username availability
 * - GET    /api/user/sessions         - Inspect active device session
 * - POST   /api/user/logout-all       - Broadcast session invalidation to other devices
 * - GET    /api/user/usage            - Tracked usage statistics from MongoDB
 * - DELETE /api/user/account          - Full GDPR account & data deletion with confirmation
 */

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '../services/firebaseAuthService.js';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  updateUserPersonalization,
  checkUsernameAvailability,
  getUserUsageStats,
  deleteUserProfileAndData
} from '../services/mongoService.js';
import { broadcastToUser } from '../services/realtimeSync.js';
import { clearMemory } from '../services/hindsightService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Ensure local avatar storage directory exists
const UPLOADS_DIR = path.resolve(__dirname, '../uploads/avatars');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('[AVATAR:STORAGE] Note creating uploads directory:', err.message);
}

// Multer storage engine with cryptographic filename generation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const cleanExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.png';
    const safeUid = String(req.user.uid).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `avatar_${safeUid}_${Date.now()}${cleanExt}`);
  }
});

// Multer upload middleware with strict security rules
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(file.mimetype.toLowerCase())) {
      return cb(new Error('Invalid image format. Supported formats: JPEG, PNG, WEBP.'));
    }
    cb(null, true);
  }
});

/**
 * Verify image magic numbers to prevent malicious executable files disguised as images
 */
function verifyImageBuffer(filePath) {
  try {
    const buffer = Buffer.alloc(12);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return true;
    }
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return true;
    }
    // WebP: 'RIFF'....'WEBP'
    if (buffer.toString('utf8', 0, 4) === 'RIFF' && buffer.toString('utf8', 8, 12) === 'WEBP') {
      return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}

// ============================================================================
// PROFILE ENDPOINTS
// ============================================================================

/**
 * GET /api/user/profile
 * Returns the verified user's profile, backfilling if missing
 */
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid, req.user);
    res.json({
      success: true,
      data: profile,
      profile
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'PROFILE_FETCH_FAILED', message: err.message }
    });
  }
});

/**
 * PATCH /api/user/profile
 * Updates allowlisted profile fields
 */
router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const body = req.body || {};

    // Validate string lengths to prevent buffer abuse / NoSQL pollution
    if (body.firstName && (typeof body.firstName !== 'string' || body.firstName.length > 50)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FIELD', message: 'First name must be under 50 characters.' }
      });
    }
    if (body.lastName && (typeof body.lastName !== 'string' || body.lastName.length > 50)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FIELD', message: 'Last name must be under 50 characters.' }
      });
    }
    if (body.displayName && (typeof body.displayName !== 'string' || body.displayName.length > 80)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FIELD', message: 'Display name must be under 80 characters.' }
      });
    }
    if (body.bio && (typeof body.bio !== 'string' || body.bio.length > 500)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FIELD', message: 'Bio must be under 500 characters.' }
      });
    }

    const updated = await updateUserProfile(req.user.uid, body);

    // Broadcast update across open tabs/devices of this user
    broadcastToUser(req.user.uid, {
      type: 'profile_updated',
      profile: updated,
      timestamp: Date.now()
    });

    res.json({
      success: true,
      data: updated,
      profile: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { code: 'PROFILE_UPDATE_FAILED', message: err.message }
    });
  }
});

/**
 * POST /api/user/profile/avatar
 * Upload and update profile photo with verification
 */
router.post('/profile/avatar', requireAuth, (req, res) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: { code: 'AVATAR_UPLOAD_ERROR', message: err.message }
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'Please select an image file to upload.' }
      });
    }

    const filePath = req.file.path;

    // Verify binary magic bytes
    if (!verifyImageBuffer(filePath)) {
      try { fs.unlinkSync(filePath); } catch (_) {}
      return res.status(400).json({
        success: false,
        error: { code: 'MALICIOUS_FILE', message: 'The uploaded file is not a valid image.' }
      });
    }

    try {
      // Build relative URL to serve statically
      const photoUrl = `/uploads/avatars/${req.file.filename}`;

      // Retrieve previous profile to safely remove previous custom uploaded avatar
      const previous = await getUserProfile(req.user.uid);
      if (previous?.profilePhotoUrl && previous.profilePhotoUrl.startsWith('/uploads/avatars/')) {
        const oldFile = path.resolve(__dirname, '..', previous.profilePhotoUrl.replace(/^\//, ''));
        if (fs.existsSync(oldFile) && oldFile !== filePath) {
          try { fs.unlinkSync(oldFile); } catch (_) {}
        }
      }

      const updated = await updateUserProfile(req.user.uid, {
        profilePhotoUrl: photoUrl
      });

      broadcastToUser(req.user.uid, {
        type: 'profile_updated',
        profile: updated,
        timestamp: Date.now()
      });

      res.json({
        success: true,
        data: {
          profilePhotoUrl: photoUrl,
          profile: updated
        },
        profile: updated,
        profilePhotoUrl: photoUrl
      });
    } catch (updateErr) {
      try { fs.unlinkSync(filePath); } catch (_) {}
      res.status(500).json({
        success: false,
        error: { code: 'AVATAR_SAVE_FAILED', message: updateErr.message }
      });
    }
  });
});

/**
 * DELETE /api/user/profile/avatar
 * Remove profile photo
 */
router.delete('/profile/avatar', requireAuth, async (req, res) => {
  try {
    const previous = await getUserProfile(req.user.uid);
    if (previous?.profilePhotoUrl && previous.profilePhotoUrl.startsWith('/uploads/avatars/')) {
      const oldFile = path.resolve(__dirname, '..', previous.profilePhotoUrl.replace(/^\//, ''));
      if (fs.existsSync(oldFile)) {
        try { fs.unlinkSync(oldFile); } catch (_) {}
      }
    }

    const updated = await updateUserProfile(req.user.uid, {
      profilePhotoUrl: null
    });

    broadcastToUser(req.user.uid, {
      type: 'profile_updated',
      profile: updated,
      timestamp: Date.now()
    });

    res.json({
      success: true,
      data: updated,
      profile: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'AVATAR_DELETE_FAILED', message: err.message }
    });
  }
});

// ============================================================================
// PREFERENCES ENDPOINTS
// ============================================================================

/**
 * GET /api/user/preferences
 */
router.get('/preferences', requireAuth, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid, req.user);
    res.json({
      success: true,
      data: profile.preferences || {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'PREFERENCES_FETCH_FAILED', message: err.message }
    });
  }
});

/**
 * PATCH /api/user/preferences
 */
router.patch('/preferences', requireAuth, async (req, res) => {
  try {
    const updated = await updateUserPreferences(req.user.uid, req.body || {});

    broadcastToUser(req.user.uid, {
      type: 'profile_updated',
      profile: updated,
      timestamp: Date.now()
    });

    res.json({
      success: true,
      data: updated.preferences
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { code: 'PREFERENCES_UPDATE_FAILED', message: err.message }
    });
  }
});

// ============================================================================
// PERSONALIZATION ENDPOINTS
// ============================================================================

/**
 * GET /api/user/personalization
 */
router.get('/personalization', requireAuth, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid, req.user);
    res.json({
      success: true,
      data: profile.personalization || {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'PERSONALIZATION_FETCH_FAILED', message: err.message }
    });
  }
});

/**
 * PATCH /api/user/personalization
 */
router.patch('/personalization', requireAuth, async (req, res) => {
  try {
    const body = req.body || {};
    if (body.customInstructions && typeof body.customInstructions === 'string' && body.customInstructions.length > 2000) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FIELD', message: 'Custom instructions cannot exceed 2000 characters.' }
      });
    }
    if (body.aboutUser && typeof body.aboutUser === 'string' && body.aboutUser.length > 1500) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FIELD', message: 'About user cannot exceed 1500 characters.' }
      });
    }

    const updated = await updateUserPersonalization(req.user.uid, body);

    broadcastToUser(req.user.uid, {
      type: 'profile_updated',
      profile: updated,
      timestamp: Date.now()
    });

    res.json({
      success: true,
      data: updated.personalization
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { code: 'PERSONALIZATION_UPDATE_FAILED', message: err.message }
    });
  }
});

// ============================================================================
// USERNAME VALIDATION ENDPOINT
// ============================================================================

/**
 * POST /api/user/username/check
 */
router.post('/username/check', requireAuth, async (req, res) => {
  try {
    const { username } = req.body || {};
    const result = await checkUsernameAvailability(username, req.user.uid);
    res.json({
      success: true,
      data: result,
      ...result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { code: 'USERNAME_CHECK_FAILED', message: err.message }
    });
  }
});

// ============================================================================
// SESSIONS & SECURITY ENDPOINTS
// ============================================================================

/**
 * GET /api/user/sessions
 * Parse active device details cleanly from User-Agent
 */
router.get('/sessions', requireAuth, (req, res) => {
  const ua = req.headers['user-agent'] || '';

  // Determine OS
  let os = 'Unknown OS';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Determine Browser
  let browser = 'Modern Browser';
  if (/edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua) && !/opr|brave/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari';

  const currentSession = {
    id: 'current',
    device: `${os} • ${browser}`,
    os,
    browser,
    isCurrent: true,
    lastActiveAt: Date.now()
  };

  res.json({
    success: true,
    data: {
      sessions: [currentSession]
    },
    sessions: [currentSession]
  });
});

/**
 * POST /api/user/logout-all
 * Force logout signal for other connected sessions
 */
router.post('/logout-all', requireAuth, (req, res) => {
  broadcastToUser(req.user.uid, {
    type: 'force_logout',
    reason: 'Signed out of all other sessions by user.',
    timestamp: Date.now()
  });

  res.json({
    success: true,
    message: 'Signed out of other sessions successfully.'
  });
});

// ============================================================================
// USAGE & ACTIVITY ENDPOINT
// ============================================================================

/**
 * GET /api/user/usage
 * Real usage telemetry directly from MongoDB
 */
router.get('/usage', requireAuth, async (req, res) => {
  try {
    const stats = await getUserUsageStats(req.user.uid);
    res.json({
      success: true,
      data: stats,
      ...stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'USAGE_FETCH_FAILED', message: err.message }
    });
  }
});

// ============================================================================
// ACCOUNT DANGER ZONE ENDPOINT
// ============================================================================

/**
 * DELETE /api/user/account
 * Complete data and profile deletion
 */
router.delete('/account', requireAuth, async (req, res) => {
  const { confirmation } = req.body || {};
  if (confirmation !== 'DELETE') {
    return res.status(400).json({
      success: false,
      error: { code: 'CONFIRMATION_REQUIRED', message: 'Explicit confirmation required. Send { confirmation: "DELETE" }.' }
    });
  }

  try {
    // 1. Wipe Hindsight semantic memory
    try {
      await clearMemory(req.bankId);
    } catch (_) {}

    // 2. Wipe user conversations, messages and profile from MongoDB
    const result = await deleteUserProfileAndData(req.user.uid);

    // 3. Broadcast termination to all active sockets of user
    broadcastToUser(req.user.uid, {
      type: 'account_deleted',
      message: 'Your account and data have been deleted.',
      timestamp: Date.now()
    });

    res.json({
      success: true,
      message: 'Your Epic Think AI account and associated data have been permanently deleted.',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'ACCOUNT_DELETION_FAILED', message: err.message }
    });
  }
});

export default router;
