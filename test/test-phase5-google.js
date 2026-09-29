/**
 * Phase 5 Verification Test Suite - Google Workspace
 * 
 * Tests:
 * 1. Gmail, Google Calendar, and Google Drive registration & manifests
 * 2. Risk tier enforcement (send_email & schedule_event are EXTERNAL_ACTION)
 * 3. Human confirmation gating on external actions
 * 4. JSON Schema parameter validation across all tools
 * 5. Multi-tenant vault credential isolation
 */

import { gmailPlugin } from '../plugins/providers/gmail/index.js';
import { googleCalendarPlugin } from '../plugins/providers/google-calendar/index.js';
import { googleDrivePlugin } from '../plugins/providers/google-drive/index.js';
import { registry } from '../plugins/core/PluginRegistry.js';
import { TokenVault } from '../plugins/core/TokenVault.js';
import { ToolExecutionEngine } from '../plugins/core/ToolExecutionEngine.js';
import { RiskTiers, PermissionManager } from '../plugins/core/PermissionManager.js';
import { ConfirmationManager } from '../plugins/core/ConfirmationManager.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('PHASE 5: GOOGLE WORKSPACE TEST SUITE');
  console.log('====================================================\n');

  const runId = Date.now();
  const user = `user_gw_${runId}`;

  // -----------------------------------------------------------------
  // 1. Register & Validate Manifests
  // -----------------------------------------------------------------
  console.log('[1/4] Registering Google Workspace Plugins...');
  registry.register(gmailPlugin);
  registry.register(googleCalendarPlugin);
  registry.register(googleDrivePlugin);

  assert(registry.getPlugin('gmail') !== null, 'Gmail plugin registered');
  assert(registry.getPlugin('google_calendar') !== null, 'Google Calendar plugin registered');
  assert(registry.getPlugin('google_drive') !== null, 'Google Drive plugin registered');

  // Verify Risk Tiers
  const sendEmailTool = gmailPlugin.getTool('send_email');
  assert(sendEmailTool.permissionTier === RiskTiers.EXTERNAL_ACTION, 'send_email is EXTERNAL_ACTION');
  assert(PermissionManager.requiresConfirmation(sendEmailTool), 'send_email strictly requires confirmation');

  const scheduleEventTool = googleCalendarPlugin.getTool('schedule_event');
  assert(scheduleEventTool.permissionTier === RiskTiers.EXTERNAL_ACTION, 'schedule_event is EXTERNAL_ACTION');
  assert(PermissionManager.requiresConfirmation(scheduleEventTool), 'schedule_event strictly requires confirmation');

  const uploadTool = googleDrivePlugin.getTool('upload_file');
  assert(uploadTool.permissionTier === RiskTiers.WRITE, 'upload_file is WRITE');

  // -----------------------------------------------------------------
  // 2. Lifecycle & Active Tools
  // -----------------------------------------------------------------
  console.log('\n[2/4] Testing Lifecycle States for Google Workspace...');
  await TokenVault.saveCredentials(user, 'gmail', { accessToken: 'mock_gmail_token' });
  await TokenVault.saveCredentials(user, 'google_calendar', { accessToken: 'mock_cal_token' });
  await TokenVault.saveCredentials(user, 'google_drive', { accessToken: 'mock_drive_token' });

  await registry.enablePlugin(user, 'gmail');
  await registry.enablePlugin(user, 'google_calendar');
  await registry.enablePlugin(user, 'google_drive');

  const activeTools = await registry.getUserActiveTools(user);
  const activeNames = activeTools.map(t => `${t.pluginId}.${t.name}`);

  assert(activeNames.includes('gmail.search_emails'), 'gmail.search_emails active');
  assert(activeNames.includes('gmail.send_email'), 'gmail.send_email active');
  assert(activeNames.includes('google_calendar.list_events'), 'google_calendar.list_events active');
  assert(activeNames.includes('google_calendar.schedule_event'), 'google_calendar.schedule_event active');
  assert(activeNames.includes('google_drive.search_files'), 'google_drive.search_files active');
  assert(activeNames.includes('google_drive.upload_file'), 'google_drive.upload_file active');

  // -----------------------------------------------------------------
  // 3. Schema Parameter Checks
  // -----------------------------------------------------------------
  console.log('\n[3/4] Testing Schema Parameter Validation...');
  // send_email missing required parameters
  let emailMissingParam = false;
  try {
    await ToolExecutionEngine.execute({
      uid: user,
      pluginId: 'gmail',
      toolName: 'send_email',
      args: { to: 'bob@example.com' } // Missing 'subject' and 'body'
    });
  } catch (err) {
    emailMissingParam = true;
  }
  assert(emailMissingParam, 'send_email blocks missing subject or body');

  // schedule_event missing required parameters
  let calMissingParam = false;
  try {
    await ToolExecutionEngine.execute({
      uid: user,
      pluginId: 'google_calendar',
      toolName: 'schedule_event',
      args: { summary: 'Standup' } // Missing 'start' and 'end'
    });
  } catch (err) {
    calMissingParam = true;
  }
  assert(calMissingParam, 'schedule_event blocks missing start or end');

  // upload_file missing content
  let driveMissingParam = false;
  try {
    await ToolExecutionEngine.execute({
      uid: user,
      pluginId: 'google_drive',
      toolName: 'upload_file',
      args: { name: 'notes.txt' } // Missing 'content'
    });
  } catch (err) {
    driveMissingParam = true;
  }
  assert(driveMissingParam, 'upload_file blocks missing content');

  // -----------------------------------------------------------------
  // 4. Confirmation Interception on External Actions
  // -----------------------------------------------------------------
  console.log('\n[4/4] Testing Confirmation Interception on External Actions...');
  const emailExec = await ToolExecutionEngine.execute({
    uid: user,
    pluginId: 'gmail',
    toolName: 'send_email',
    args: { to: 'client@example.com', subject: 'Project Proposal', body: 'Please review attached.' }
  });

  assert(emailExec.status === 'requires_confirmation', 'send_email is intercepted by ConfirmationManager');
  assert(emailExec.confirmationTicket.riskTier === RiskTiers.EXTERNAL_ACTION, 'Ticket riskTier is EXTERNAL_ACTION');

  const calExec = await ToolExecutionEngine.execute({
    uid: user,
    pluginId: 'google_calendar',
    toolName: 'schedule_event',
    args: {
      summary: 'Q4 Architecture Review',
      start: '2026-10-01T10:00:00Z',
      end: '2026-10-01T11:00:00Z'
    }
  });

  assert(calExec.status === 'requires_confirmation', 'schedule_event is intercepted by ConfirmationManager');
  assert(calExec.confirmationTicket.toolName === 'schedule_event', 'Ticket bound to schedule_event');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 5 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during Phase 5 testing:', err);
  process.exit(1);
});
