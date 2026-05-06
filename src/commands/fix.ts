import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as log from '../utils/logger.js';
import { GateReport, GateResult } from '../core/gate-runner.js';
import { detectAgent, getAgentDisplayName } from '../core/agent-detect.js';

export function registerFixCommand(program: Command): void {
  program
    .command('fix')
    .description('Generate an AI prompt to auto-fix the last quality gate failure')
    .action(() => {
      const reportPath = join(process.cwd(), '.sysvibe', 'last_run.json');

      if (!existsSync(reportPath)) {
        log.error('No previous check results found.');
        log.info('Run "sysvibe check" first to generate a quality report.');
        process.exit(1);
      }

      let report: GateReport;
      try {
        const content = readFileSync(reportPath, 'utf-8');
        report = JSON.parse(content) as GateReport;
      } catch (err) {
        log.error('Failed to read .sysvibe/last_run.json. It may be corrupted.');
        process.exit(1);
      }

      if (report.success) {
        log.success('Last run was successful! Nothing to fix.');
        process.exit(0);
      }

      const failedGate = report.results.find((r: GateResult) => !r.success);
      if (!failedGate) {
        log.error('Report indicates failure, but no failed gate was found in the results.');
        process.exit(1);
      }

      log.banner('AUTO-FIX LOOP');
      log.info(`Analyzing failure: [${failedGate.packName}] ${failedGate.name}`);

      const errorOutput = failedGate.stderr.trim() || failedGate.stdout.trim() || '(No output provided)';

      const promptContent = `# SysVibe Quality Gate Failure

You are an expert systems programmer. A SysVibe quality gate has failed.
Analyze the error, locate the offending file(s), and apply the necessary fix.

**CRITICAL CONSTRAINT:** Adhere strictly to the SysVibe rules defined in this project's configuration (e.g., CLAUDE.md, .cursorrules, or AGENTS.md). Do not violate them while fixing this issue.

## Failed Gate
- **Gate:** ${failedGate.name} (${failedGate.packName})
- **Command:** \`${failedGate.command}\`

## Error Output
\`\`\`text
${errorOutput}
\`\`\`

Fix the issue, then summarize what you changed.
`;

      const promptPath = join(process.cwd(), '.sysvibe', 'fix-prompt.md');
      writeFileSync(promptPath, promptContent, 'utf-8');

      log.success('Fix prompt generated: .sysvibe/fix-prompt.md');
      console.log('');

      const agent = detectAgent();
      log.heading(`Instructions for ${getAgentDisplayName(agent.type)}:`);

      switch (agent.type) {
        case 'claude-code':
          console.log(`  Run: cat .sysvibe/fix-prompt.md | claude`);
          break;
        case 'gemini-cli':
          console.log(`  Run: gemini --prompt-file .sysvibe/fix-prompt.md`);
          break;
        case 'cursor':
          console.log(`  1. Open Cursor Chat (Cmd/Ctrl + L)`);
          console.log(`  2. Type "@.sysvibe/fix-prompt.md" and press Enter`);
          break;
        case 'openclaw':
        case 'codex':
        default:
          console.log(`  Pass the file ".sysvibe/fix-prompt.md" to your agent as context.`);
          break;
      }

      console.log('');
      log.info('After the agent fixes the code, run "sysvibe check" again.');
    });
}
