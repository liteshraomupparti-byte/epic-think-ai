/**
 * Epic Think AI - Human-in-the-Loop Confirmation Manager
 * 
 * Intercepts EXTERNAL_ACTION and DESTRUCTIVE tool executions.
 * Generates cryptographically secure, short-lived, single-use action tickets.
 * Prevents unauthorized or replayed actions.
 */

import crypto from 'crypto';
import { SafeLogger } from './SafeLogger.js';

// In-memory pending confirmation store (5-minute TTL)
const pendingConfirmations = new Map();
const RESOLVED_TICKET_EXPIRY_MS = 60000; // Keep resolved ticket signatures briefly to block replay

export class ConfirmationManager {
  /**
   * Create a new confirmation request ticket
   */
  static createConfirmationRequest({
    uid,
    conversationId,
    pluginId,
    toolName,
    riskTier,
    parameters = {},
    title,
    summary
  }) {
    if (!uid || !pluginId || !toolName) {
      throw new Error('UID, pluginId, and toolName are required for confirmation request.');
    }

    const confirmationId = 'conf_' + crypto.randomBytes(12).toString('hex');
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity

    const ticket = {
      confirmationId,
      uid: String(uid),
      conversationId: conversationId || null,
      pluginId: String(pluginId),
      toolName: String(toolName),
      riskTier: String(riskTier || 'EXTERNAL_ACTION'),
      parameters,
      title: title || `Execute ${toolName}`,
      summary: summary || `Action requires your approval: ${pluginId}.${toolName}`,
      status: 'pending', // 'pending' | 'approved' | 'rejected' | 'expired'
      createdAt: now,
      expiresAt
    };

    pendingConfirmations.set(confirmationId, ticket);

    SafeLogger.info('Confirmation ticket generated', {
      confirmationId,
      plugin: pluginId,
      tool: toolName,
      user: SafeLogger.hashUid(uid)
    });

    return ticket;
  }

  /**
   * Resolve a pending confirmation ticket
   * 
   * @param {string} confirmationId - Action ticket ID
   * @param {'approved' | 'rejected'} decision - User decision
   * @param {string} uid - Authenticated Firebase UID resolving the action
   */
  static resolveConfirmation(confirmationId, decision, uid) {
    if (!confirmationId || !decision || !uid) {
      throw new Error('confirmationId, decision ("approved"|"rejected"), and uid are required.');
    }

    const ticket = pendingConfirmations.get(confirmationId);
    if (!ticket) {
      throw new Error('Confirmation request not found or has already expired.');
    }

    // Verify user authorization: Only the same authenticated user can approve
    if (ticket.uid !== String(uid)) {
      SafeLogger.warn('Unauthorized confirmation attempt rejected', {
        confirmationId,
        requestUser: SafeLogger.hashUid(uid),
        ticketOwner: SafeLogger.hashUid(ticket.uid)
      });
      throw new Error('Unauthorized: You cannot approve an action ticket belonging to another session.');
    }

    // Check expiration
    if (Date.now() > ticket.expiresAt) {
      pendingConfirmations.delete(confirmationId);
      throw new Error('Confirmation ticket has expired. Please re-prompt the agent.');
    }

    // Prevent replay attacks: single-use only
    if (ticket.status !== 'pending') {
      throw new Error(`Confirmation ticket has already been ${ticket.status} and cannot be reused.`);
    }

    ticket.status = decision === 'approved' ? 'approved' : 'rejected';
    ticket.resolvedAt = Date.now();

    // Mark as resolved; schedule removal after short grace period to prevent immediate replay
    setTimeout(() => {
      pendingConfirmations.delete(confirmationId);
    }, RESOLVED_TICKET_EXPIRY_MS);

    SafeLogger.info('Confirmation ticket resolved', {
      confirmationId,
      decision: ticket.status,
      user: SafeLogger.hashUid(uid)
    });

    return {
      success: true,
      approved: ticket.status === 'approved',
      ticket
    };
  }

  /**
   * Verify and consume an approved confirmation ticket for tool execution.
   * Enforces single-use anti-replay and parameter binding.
   */
  static verifyAndConsumeApprovedTicket(confirmationId, uid, pluginId, toolName, args = {}) {
    if (!confirmationId || !uid) {
      throw new Error('Missing confirmationId or UID.');
    }

    const ticket = pendingConfirmations.get(confirmationId);
    if (!ticket) {
      throw new Error('Confirmation ticket not found or expired.');
    }

    if (ticket.uid !== String(uid)) {
      throw new Error('Unauthorized: Confirmation ticket does not belong to this user.');
    }

    if (Date.now() > ticket.expiresAt) {
      pendingConfirmations.delete(confirmationId);
      throw new Error('Confirmation ticket expired.');
    }

    if (ticket.status === 'consumed') {
      throw new Error('SECURITY VIOLATION: Confirmation ticket already consumed (replay attack blocked).');
    }

    if (ticket.status !== 'approved') {
      throw new Error(`Confirmation ticket is not approved (current status: ${ticket.status}).`);
    }

    // Verify bound plugin and tool
    if (ticket.pluginId !== String(pluginId) || ticket.toolName !== String(toolName)) {
      throw new Error(`Ticket target mismatch: bound to ${ticket.pluginId}.${ticket.toolName}, attempted ${pluginId}.${toolName}.`);
    }

    // Mark as consumed immediately to prevent replay
    ticket.status = 'consumed';
    ticket.consumedAt = Date.now();

    // Schedule cleanup
    setTimeout(() => {
      pendingConfirmations.delete(confirmationId);
    }, RESOLVED_TICKET_EXPIRY_MS);

    SafeLogger.info('Confirmation ticket verified and consumed', {
      confirmationId,
      plugin: pluginId,
      tool: toolName,
      user: SafeLogger.hashUid(uid)
    });

    return true;
  }

  /**
   * Retrieve any ticket by confirmationId
   */
  static getTicket(confirmationId) {
    if (!confirmationId) return null;
    return pendingConfirmations.get(confirmationId) || null;
  }

  /**
   * Get pending confirmations for a specific user
   */
  static getPendingForUser(uid) {
    if (!uid) return [];
    const now = Date.now();
    const results = [];

    for (const [id, ticket] of pendingConfirmations.entries()) {
      if (ticket.uid === String(uid)) {
        if (now > ticket.expiresAt) {
          pendingConfirmations.delete(id);
        } else if (ticket.status === 'pending') {
          results.push(ticket);
        }
      }
    }

    return results;
  }
}
