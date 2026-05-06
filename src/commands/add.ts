import { Command } from 'commander';
import * as log from '../utils/logger.js';
import { configExists, readConfig, addPack } from '../core/config.js';
import { isValidPack, getAvailablePacks, getPackDisplayName } from '../core/pack-manager.js';
import { generateAgentConfig } from '../core/config-gen.js';
import { checkToolchain, printToolchainReport } from '../core/toolchain.js';
import type { AgentType } from '../core/agent-detect.js';

export function registerAddCommand(program: Command): void {
  program
    .command('add')
    .description('Add a language pack to your project')
    .argument('<pack>', 'Language pack to add (e.g., cpp, rust)')
    .action(async (pack: string) => {
      log.banner('ADDING PACK');

      // Check if initialized
      if (!configExists()) {
        log.error('SysVibe is not initialized. Run "sysvibe init" first.');
        process.exit(1);
      }

      // Validate pack name
      if (!isValidPack(pack)) {
        log.error(`Unknown pack: "${pack}"`);
        log.info(`Available packs: ${getAvailablePacks().join(', ')}`);
        process.exit(1);
      }

      // Check if already active
      const config = readConfig();
      if (config.packs.active.includes(pack)) {
        log.warn(`Pack "${getPackDisplayName(pack)}" is already active.`);
        return;
      }

      // Check toolchain for new pack
      const report = checkToolchain([pack]);
      printToolchainReport(report);
      console.log('');

      // Add pack to config
      addPack(pack);
      log.success(`Added pack: ${getPackDisplayName(pack)}`);

      // Refresh agent config with all packs
      const updatedConfig = readConfig();
      generateAgentConfig(updatedConfig.packs.active, updatedConfig.agent.type as AgentType);
      log.success('Agent rules refreshed.');
    });
}
