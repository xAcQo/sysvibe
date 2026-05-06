import { Command } from 'commander';
import * as log from '../utils/logger.js';
import { configExists, readConfig } from '../core/config.js';
import { checkToolchain } from '../core/toolchain.js';
import { runGates, saveGateReport } from '../core/gate-runner.js';

export function registerCheckCommand(program: Command): void {
  program
    .command('check')
    .description('Run quality gate pipeline (compile, lint, sanitize, test)')
    .action(async () => {
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

      // Run gates sequentially
      const gateReport = await runGates(packs);
      
      // Save output for auto-fix
      saveGateReport(gateReport);

      console.log('');
      if (gateReport.success) {
        log.success('All quality gates passed!');
        process.exit(0);
      } else {
        log.error("Quality gates failed. Run 'sysvibe fix' to auto-fix.");
        process.exit(1);
      }
    });
}
