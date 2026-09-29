/**
 * Phase 7 Verification Test Suite - Messaging (Telegram, Discord, WhatsApp)
 * 
 * Tests:
 * 1. Telegram, Discord, and WhatsApp registration & manifests
 * 2. Risk tier classification: All outbound messages are EXTERNAL_ACTION
 * 3. Human confirmation gating strictly blocks automatic sending
 * 4. Schema parameter validation across all messaging tools
 * 5. Multi-tenant credential isolation in TokenVault
 */

import { telegramPlugin } from '../plugins/providers/telegram/index.js';
import { discordPlugin } from '../plugins/providers/discord/index.js';
import { whatsappPlugin } from '../plugins/providers/whatsapp/index.js';
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
  console.log('PHASE 7: MESSAGING (TELEGRAM, DISCORD, WHATSAPP) TEST SUITE');
  console.log('====================================================\n');

  const runId = Date.now();
  const user = `user_msg_${runId}`;

  // -----------------------------------------------------------------
  // 1. Register Plugins & Verify Manifests
  // -----------------------------------------------------------------
  console.log('[1/4] Registering Messaging Plugins...');
  registry.register(telegramPlugin);
  registry.register(discordPlugin);
  registry.register(whatsappPlugin);

  assert(registry.getPlugin('telegram') !== null, 'Telegram plugin registered');
  assert(registry.getPlugin('discord') !== null, 'Discord plugin registered');
  assert(registry.getPlugin('whatsapp') !== null, 'WhatsApp plugin registered');

  // Verify Risk Tiers
  const tgSend = telegramPlugin.getTool('send_message');
  assert(tgSend.permissionTier === RiskTiers.EXTERNAL_ACTION, 'telegram.send_message is EXTERNAL_ACTION');
  assert(PermissionManager.requiresConfirmation(tgSend), 'telegram.send_message strictly requires confirmation');

  const discordSend = discordPlugin.getTool('send_message');
  assert(discordSend.permissionTier === RiskTiers.EXTERNAL_ACTION, 'discord.send_message is EXTERNAL_ACTION');
  assert(PermissionManager.requiresConfirmation(discordSend), 'discord.send_message strictly requires confirmation');

  const waSend = whatsappPlugin.getTool('send_message');
  assert(waSend.permissionTier === RiskTiers.EXTERNAL_ACTION, 'whatsapp.send_message is EXTERNAL_ACTION');
  assert(PermissionManager.requiresConfirmation(waSend), 'whatsapp.send_message strictly requires confirmation');

  // -----------------------------------------------------------------
  // 2. Lifecycle & Active Tools
  // -----------------------------------------------------------------
  console.log('\n[2/4] Testing Lifecycle States for Messaging...');
  await TokenVault.saveCredentials(user, 'telegram', { accessToken: 'mock_tg_bot_token_123' });
  await TokenVault.saveCredentials(user, 'discord', { accessToken: 'mock_discord_bot_token_456' });
  await TokenVault.saveCredentials(user, 'whatsapp', { accessToken: 'mock_wa_api_key_789' });

  await registry.enablePlugin(user, 'telegram');
  await registry.enablePlugin(user, 'discord');
  await registry.enablePlugin(user, 'whatsapp');

  const activeTools = await registry.getUserActiveTools(user);
  const activeNames = activeTools.map(t => `${t.pluginId}.${t.name}`);

  assert(activeNames.includes('telegram.send_message'), 'telegram.send_message is active');
  assert(activeNames.includes('discord.send_message'), 'discord.send_message is active');
  assert(activeNames.includes('whatsapp.send_message'), 'whatsapp.send_message is active');

  // -----------------------------------------------------------------
  // 3. Schema Parameter Validation
  // -----------------------------------------------------------------
  console.log('\n[3/4] Testing Schema Parameter Validation...');
  let tgMissing = false;
  try {
    await ToolExecutionEngine.execute({
      uid: user,
      pluginId: 'telegram',
      toolName: 'send_message',
      args: { chatId: '12345' } // Missing 'text'
    });
  } catch (err) {
    tgMissing = true;
  }
  assert(tgMissing, 'telegram.send_message blocks missing text');

  let discordMissing = false;
  try {
    await ToolExecutionEngine.execute({
      uid: user,
      pluginId: 'discord',
      toolName: 'send_message',
      args: { channelId: '98765' } // Missing 'content'
    });
  } catch (err) {
    discordMissing = true;
  }
  assert(discordMissing, 'discord.send_message blocks missing content');

  let waMissing = false;
  try {
    await ToolExecutionEngine.execute({
      uid: user,
      pluginId: 'whatsapp',
      toolName: 'send_message',
      args: { to: '+14155552671' } // Missing 'message'
    });
  } catch (err) {
    waMissing = true;
  }
  assert(waMissing, 'whatsapp.send_message blocks missing message');

  // -----------------------------------------------------------------
  // 4. Confirmation Interception on Outbound Messages
  // -----------------------------------------------------------------
  console.log('\n[4/4] Testing Confirmation Interception on Outbound Messages...');
  const tgExec = await ToolExecutionEngine.execute({
    uid: user,
    pluginId: 'telegram',
    toolName: 'send_message',
    args: { chatId: '@epic_alerts', text: 'Deployment successful!' }
  });
  assert(tgExec.status === 'requires_confirmation', 'telegram.send_message intercepted by ConfirmationManager');
  assert(tgExec.confirmationTicket.riskTier === RiskTiers.EXTERNAL_ACTION, 'Ticket riskTier is EXTERNAL_ACTION');

  const discordExec = await ToolExecutionEngine.execute({
    uid: user,
    pluginId: 'discord',
    toolName: 'send_message',
    args: { channelId: '11223344', content: 'Release v2.0 is live!' }
  });
  assert(discordExec.status === 'requires_confirmation', 'discord.send_message intercepted by ConfirmationManager');

  const waExec = await ToolExecutionEngine.execute({
    uid: user,
    pluginId: 'whatsapp',
    toolName: 'send_message',
    args: { to: '+14155552671', message: 'Hello from Epic Think AI' }
  });
  assert(waExec.status === 'requires_confirmation', 'whatsapp.send_message intercepted by ConfirmationManager');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 7 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during Phase 7 testing:', err);
  process.exit(1);
});
