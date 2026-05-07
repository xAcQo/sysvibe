import { Command } from 'commander';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as log from '../utils/logger.js';
import { configExists, readConfig, getConfigPath } from '../core/config.js';
import { removeSysVibeSection } from '../core/config-gen.js';

export function registerEjectCommand(program: Command): void {
  program
    .command('eject')
    .description('Remove SysVibe rules from agent configs and delete .sysvibe.toml')
    .action(async () => {
      log.banner('EJECTING');

      if (!configExists()) {
        log.error('SysVibe is not initialized (.sysvibe.toml not found).');
        log.info('Nothing to eject.');
        process.exit(1);
      }

      const config = readConfig();
      const cwd = process.cwd();

      // Remove SysVibe section from the primary agent config file
      const primaryConfigPath = join(cwd, config.agent.config_file);
      if (existsSync(primaryConfigPath)) {
        removeSysVibeSection(primaryConfigPath);
        log.success(`Cleaned: ${config.agent.config_file}`);
      } else {
        log.warn(`Agent config not found: ${config.agent.config_file} (skipped)`);
      }

      // Also clean AGENTS.md if it exists and is not the primary
      if (config.agent.config_file !== 'AGENTS.md') {
        const agentsPath = join(cwd, 'AGENTS.md');
        if (existsSync(agentsPath)) {
          removeSysVibeSection(agentsPath);
          log.success('Cleaned: AGENTS.md');
        }
      }

      // Remove .sysvibe.toml
      const configPath = getConfigPath();
      if (existsSync(configPath)) {
        unlinkSync(configPath);
        log.success('Deleted: .sysvibe.toml');
      }

      // Remove .sysvibe/ directory if it exists (gate reports, etc.)
      const sysvibeDir = join(cwd, '.sysvibe');
      if (existsSync(sysvibeDir)) {
        // Only warn — don't delete generated report data automatically
        log.info('Note: .sysvibe/ directory still exists (contains gate reports).');
        log.info('Delete manually if no longer needed: rm -rf .sysvibe/');
      }

      console.log('');
      log.banner('EJECTED');
      log.success('SysVibe has been cleanly removed from this project.');
      log.info('Your agent config files are preserved — only SysVibe sections were removed.');
    });
}
