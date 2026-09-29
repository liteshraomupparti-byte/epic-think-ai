/**
 * Epic Think AI - Agent Planner & Confirmation API Routes
 * 
 * Provides:
 * - POST /api/agent/chat (Autonomous agent planner execution)
 * - GET /api/agent/active-tools (Currently active tools for user)
 * - GET /api/confirmations/pending (Pending action tickets)
 * - POST /api/confirmations/:id/resolve (Approve or reject action ticket)
 */

import express from 'express';
import { requireAuth } from '../services/firebaseAuthService.js';
import { AgentPlanner } from '../plugins/core/AgentPlanner.js';
import { ConfirmationManager } from '../plugins/core/ConfirmationManager.js';
import { registry } from '../plugins/index.js';
import { SafeLogger } from '../plugins/core/SafeLogger.js';

const router = express.Router();

/**
 * Execute Agent Planner for an authenticated user query
 * POST /api/agent/chat
 */
router.post('/chat', requireAuth, async (req, res) => {
  const { prompt, text, conversationId, confirmationId, options } = req.body || {};
  const userPrompt = prompt || text;

  if (!userPrompt && !confirmationId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: "prompt" or "confirmationId".'
    });
  }

  try {
    const result = await AgentPlanner.planAndExecute({
      uid: req.user.uid,
      userPrompt: userPrompt || 'Resume confirmed action',
      conversationId,
      confirmationId,
      options
    });

    res.json({
      success: true,
      text: result.text,
      thoughts: result.thoughts,
      recalledMemoriesCount: result.recalledMemoriesCount,
      executedToolCalls: result.executedToolCalls,
      requiresConfirmation: result.requiresConfirmation,
      confirmationTicket: result.confirmationTicket,
      ticket: result.confirmationTicket ? {
        ...result.confirmationTicket,
        id: result.confirmationTicket.confirmationId || result.confirmationTicket.id,
        confirmationId: result.confirmationTicket.confirmationId || result.confirmationTicket.id,
        tool: result.confirmationTicket.toolName || result.confirmationTicket.tool,
        toolName: result.confirmationTicket.toolName || result.confirmationTicket.tool,
        risk: result.confirmationTicket.riskTier || result.confirmationTicket.risk,
        riskTier: result.confirmationTicket.riskTier || result.confirmationTicket.risk,
        params: result.confirmationTicket.parameters || result.confirmationTicket.params,
        parameters: result.confirmationTicket.parameters || result.confirmationTicket.params
      } : null,
      durationMs: result.durationMs
    });
  } catch (err) {
    SafeLogger.error('AgentPlanner chat endpoint error', {
      user: SafeLogger.hashUid(req.user.uid),
      error: err.message
    });

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Get active tools currently enabled for the authenticated user
 * GET /api/agent/active-tools
 */
router.get('/active-tools', requireAuth, async (req, res) => {
  try {
    const tools = await registry.getUserActiveTools(req.user.uid);
    res.json({
      success: true,
      count: tools.length,
      tools: tools.map(t => ({
        pluginId: t.pluginId,
        name: t.name,
        description: t.description,
        permissionTier: t.permissionTier
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get pending confirmation requests for authenticated user
 * GET /api/confirmations/pending
 */
router.get('/confirmations/pending', requireAuth, async (req, res) => {
  try {
    const tickets = ConfirmationManager.getPendingForUser(req.user.uid);
    res.json({
      success: true,
      tickets
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Resolve confirmation ticket
 * POST /api/confirmations/:id/resolve
 * Body: { decision: 'approved' | 'rejected' }
 */
router.post('/confirmations/:id/resolve', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body || {};

  if (!decision || (decision !== 'approved' && decision !== 'rejected')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid decision: expected "approved" or "rejected".'
    });
  }

  try {
    const resolution = ConfirmationManager.resolveConfirmation(id, decision, req.user.uid);
    res.json(resolution);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

export default router;
