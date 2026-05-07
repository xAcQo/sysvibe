import { Command } from 'commander';
import * as log from '../utils/logger.js';
import { configExists, readConfig } from '../core/config.js';
import { checkToolchain } from '../core/toolchain.js';
import { runGates, saveGateReport } from '../core/gate-runner.js';
import { hashWorkspace, getCache, saveCache } from '../core/cache.js';

export function registerCheckCommand(program: Command): void {
  program
    .command('check')
    .description('Run quality gate pipeline (compile, lint, sanitize, test)')
    .option('-f, --force', 'Force a full check even if no files changed')
    .action(async (options: { force?: boolean }) => {
      if (!configExists()) {
        log.error('SysVibe is not initialized. Run "sysvibe init" first.');
        process.exit(1);
      }

      const config = readConfig();
      const packs = config.packs.active;

      if (packs.length === 0) {
        log.error('No language packs active. Run "sysvibe add <pack>".');
        process.exit(1);
      }

      // Check toolchain but only warn on missing tools (don't block, let the gate fail)
      const report = checkToolchain(packs);
      if (!report.allRequiredFound) {
        for (const warning of report.warnings) {
          log.warn(warning);
        }
      }

      const currentHash = hashWorkspace(process.cwd());
      const cachedHash = getCache();

      if (!options.force && cachedHash === currentHash) {
        log.success('Skipping gates: No files changed since last successful check.');
        process.exit(0);
      }

      // Run gates sequentially (includes custom gates from .sysvibe.toml)
      const gateReport = await runGates(packs, config.gates.custom);
      
      // Save output for auto-fix
      saveGateReport(gateReport);

      console.log('');
      if (gateReport.success) {
        saveCache(currentHash);
        log.success('All quality gates passed!');
        process.exit(0);
      } else {
        log.error("Quality gates failed. Run 'sysvibe fix' to auto-fix.");
        process.exit(1);
      }
    });
}
