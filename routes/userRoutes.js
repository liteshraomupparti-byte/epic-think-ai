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
  getUserDetailedUsage,
  updateUserTier,
  deleteUserProfileAndData
} from '../services/mongoService.js';
import { broadcastToUser } from '../services/realtimeSync.js';
import { clearMemory } from '../services/hindsightService.js';
import { QuotaTrackingService, USER_TIERS } from '../services/usage/QuotaTrackingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Serverless hosts (Vercel, Lambda) have a read-only / ephemeral filesystem.
// Files written there disappear between invocations, so avatars MUST be
// persisted inside the user document (as an optimized data URL) instead.
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Max size of an avatar data URL stored directly in the profile document (~3 MB)
const MAX_DB_AVATAR_BYTES = 3 * 1024 * 1024;

// Ensure local avatar storage directory exists (local / long-running servers only)
const UPLOADS_DIR = path.resolve(__dirname, '../uploads/avatars');
if (!IS_SERVERLESS) {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('[AVATAR:STORAGE] Note creating uploads directory:', err.message);
  }
}

// Keep uploads in memory so we can validate and choose the persistence strategy
const storage = multer.memoryStorage();

// Multer upload middleware with strict security rules
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
    fieldSize: 8 * 1024 * 1024 // allow the optimized avatarDataUrl text field
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      'image/jpeg', 'image/jpg', 'image/pjpeg',
      'image/png', 'image/x-png',
      'image/webp',
      'image/gif'
    ];
    const mime = (file.mimetype || '').toLowerCase();
    const ext = path.extname(file.originalname || '').toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    if (allowedMime.includes(mime) || allowedExts.includes(ext)) {
      return cb(null, true);
    }
    cb(new Error('Invalid image format. Supported formats: JPG, PNG, WEBP, GIF.'));
  }
});

/**
 * Verify image magic numbers to prevent malicious executable files disguised as images
 */
function verifyImageBuffer(input) {
  try {
    let buffer;
    if (Buffer.isBuffer(input)) {
      buffer = input.subarray(0, 16);
    } else {
      buffer = Buffer.alloc(16);
      const fd = fs.openSync(input, 'r');
      fs.readSync(fd, buffer, 0, 16, 0);
      fs.closeSync(fd);
    }
    if (buffer.length < 4) return false;

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
    // GIF: GIF87a or GIF89a
    if (buffer.toString('utf8', 0, 3) === 'GIF') {
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
    if (profile?.profilePhotoUrl && typeof profile.profilePhotoUrl === 'string' && profile.profilePhotoUrl.startsWith('/uploads/avatars/')) {
      try {
        const diskFile = path.resolve(__dirname, '..', profile.profilePhotoUrl.replace(/^\//, ''));
        if (fs.existsSync(diskFile)) {
          const buf = fs.readFileSync(diskFile);
          const ext = path.extname(diskFile).toLowerCase().replace('.', '') || 'png';
          const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
          profile.profilePhotoUrl = `data:${mime};base64,${buf.toString('base64')}`;
          await updateUserProfile(req.user.uid, { profilePhotoUrl: profile.profilePhotoUrl });
        }
      } catch (_) {}
    }
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
 * Decode a base64 image data URL into { buffer, ext, mime }. Returns null if invalid.
 */
function decodeImageDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!matches) return null;
  const rawExt = matches[1].toLowerCase().replace('jpeg', 'jpg');
  const ext = ['jpg', 'png', 'webp', 'gif'].includes(rawExt) ? rawExt : 'png';
  try {
    const buffer = Buffer.from(matches[2], 'base64');
    return { buffer, ext, mime: `image/${ext === 'jpg' ? 'jpeg' : ext}` };
  } catch (_) {
    return null;
  }
}

/**
 * Remove a previously stored on-disk avatar (local servers only)
 */
function removeOldDiskAvatar(previousUrl, keepFilename = '') {
  if (IS_SERVERLESS) return;
  if (!previousUrl || typeof previousUrl !== 'string' || !previousUrl.startsWith('/uploads/avatars/')) return;
  try {
    const oldFile = path.resolve(__dirname, '..', previousUrl.replace(/^\//, ''));
    if (!oldFile.startsWith(UPLOADS_DIR)) return;
    if (keepFilename && path.basename(oldFile) === keepFilename) return;
    if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
  } catch (_) {}
}

/**
 * Persist a validated avatar image and return the URL to store on the profile.
 *
 * - Serverless (Vercel): the filesystem is ephemeral, so the optimized image is
 *   stored inline as a data URL inside the user document. This is what keeps the
 *   avatar alive after a page refresh / cold start.
 * - Local / long-running servers: written to /uploads/avatars, falling back to an
 *   inline data URL if the disk write fails.
 */
function persistAvatarImage(uid, { buffer, ext, mime }) {
  const inlineDataUrl = `data:${mime};base64,${buffer.toString('base64')}`;

  let filename = '';
  if (!IS_SERVERLESS) {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      const safeUid = String(uid).replace(/[^a-zA-Z0-9_-]/g, '_');
      filename = `avatar_${safeUid}_${Date.now()}.${ext}`;
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
    } catch (writeErr) {
      console.warn('[AVATAR:DISK_WRITE] Note writing local disk backup:', writeErr.message);
    }
  }

  if (inlineDataUrl.length > MAX_DB_AVATAR_BYTES) {
    const err = new Error('Image is too large to store. Please choose a smaller photo.');
    err.status = 413;
    throw err;
  }
  return { photoUrl: inlineDataUrl, filename };
}

/**
 * Shared avatar save flow for JSON and multipart uploads
 */
async function saveAvatarForRequest(req, res, image) {
  if (!image || !image.buffer || image.buffer.length === 0) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_IMAGE_DATA', message: 'Please select a valid image file to upload.' }
    });
  }

  if (image.buffer.length > 5 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      error: { code: 'FILE_TOO_LARGE', message: 'Image exceeds 5MB size limit.' }
    });
  }

  // Verify binary magic bytes
  if (!verifyImageBuffer(image.buffer)) {
    return res.status(400).json({
      success: false,
      error: { code: 'MALICIOUS_FILE', message: 'The uploaded file is not a valid image.' }
    });
  }

  try {
    const previous = await getUserProfile(req.user.uid);
    const { photoUrl, filename } = persistAvatarImage(req.user.uid, image);

    const updated = await updateUserProfile(req.user.uid, { profilePhotoUrl: photoUrl });

    // Only remove the old file once the new avatar is safely saved
    removeOldDiskAvatar(previous?.profilePhotoUrl, filename);

    broadcastToUser(req.user.uid, {
      type: 'profile_updated',
      profile: updated,
      timestamp: Date.now()
    });

    return res.json({
      success: true,
      data: {
        profilePhotoUrl: photoUrl,
        profile: updated
      },
      profile: updated,
      profilePhotoUrl: photoUrl
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      error: { code: 'AVATAR_SAVE_FAILED', message: err.message }
    });
  }
}

/**
 * POST /api/user/profile/avatar
 * Upload and update profile photo with verification
 */
router.post('/profile/avatar', requireAuth, (req, res) => {
  const contentType = (req.headers['content-type'] || '').toLowerCase();

  // 1. JSON Data URL upload (preferred: client sends an optimized 512px image)
  if (contentType.includes('application/json')) {
    const rawData = req.body?.avatarDataUrl || req.body?.avatar || req.body?.profilePhotoUrl;
    const image = decodeImageDataUrl(rawData);
    if (!image) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_IMAGE_DATA', message: 'Please select a valid image file to upload.' }
      });
    }
    return saveAvatarForRequest(req, res, image);
  }

  // 2. Standard Multipart / Multer upload
  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: { code: 'AVATAR_UPLOAD_ERROR', message: err.message }
      });
    }

    // Prefer the client-optimized data URL if supplied alongside the file
    const optimized = decodeImageDataUrl(req.body?.avatarDataUrl);
    if (optimized) {
      return saveAvatarForRequest(req, res, optimized);
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'Please select an image file to upload.' }
      });
    }

    const ext = (path.extname(req.file.originalname || '').toLowerCase().replace('.', '') || 'png').replace('jpeg', 'jpg');
    const safeExt = ['jpg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'png';
    return saveAvatarForRequest(req, res, {
      buffer: req.file.buffer,
      ext: safeExt,
      mime: `image/${safeExt === 'jpg' ? 'jpeg' : safeExt}`
    });
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

// Helper to support both authenticated users and guest sessions
const optionalUserAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return requireAuth(req, res, next);
  }
  req.user = { uid: 'guest_user', email: 'guest@epicthink.ai' };
  next();
};

/**
 * GET /api/user/quota
 * Real-time quota, rate limits, tier status, and reset timers
 */
router.get('/quota', optionalUserAuth, async (req, res) => {
  try {
    const profile = req.user.uid !== 'guest_user' ? await getUserProfile(req.user.uid, req.user) : null;
    const tier = profile?.tier || (req.user.uid === 'guest_user' ? 'guest' : 'free');
    const summary = QuotaTrackingService.getUsageSummary(req.user.uid, tier);
    res.json({
      success: true,
      data: summary,
      ...summary
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'QUOTA_FETCH_FAILED', message: err.message }
    });
  }
});

/**
 * GET /api/user/usage
 * Real usage telemetry and activity records directly from MongoDB
 */
router.get('/usage', optionalUserAuth, async (req, res) => {
  try {
    const detailed = await getUserDetailedUsage(req.user.uid, 30);
    const stats = await getUserUsageStats(req.user.uid);
    res.json({
      success: true,
      data: {
        ...stats,
        ...detailed
      },
      ...stats,
      records: detailed.records,
      summary: detailed.summary
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'USAGE_FETCH_FAILED', message: err.message }
    });
  }
});

/**
 * POST /api/user/tier
 * Update account tier (e.g. 'free' -> 'pro' -> 'admin')
 */
router.post('/tier', requireAuth, async (req, res) => {
  try {
    const { tier } = req.body || {};
    if (!tier || !USER_TIERS[tier]) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TIER', message: `Invalid tier. Allowed: ${Object.keys(USER_TIERS).join(', ')}` }
      });
    }

    const updatedProfile = await updateUserTier(req.user.uid, tier);

    broadcastToUser(req.user.uid, {
      type: 'profile_updated',
      profile: updatedProfile,
      timestamp: Date.now()
    });

    res.json({
      success: true,
      message: `Account tier updated to ${USER_TIERS[tier].name}`,
      tier: updatedProfile.tier,
      tierDetails: USER_TIERS[tier]
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: { code: 'TIER_UPDATE_FAILED', message: err.message }
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
