import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as log from '../utils/logger.js';
import { runCommandAsync } from '../utils/shell.js';
import { loadPack } from './pack-manager.js';

export interface GateResult {
  name: string;
  packName: string;
  success: boolean;
  durationMs: number;
  stdout: string;
  stderr: string;
  command: string;
}

export interface GateReport {
  timestamp: string;
  success: boolean;
  results: GateResult[];
}

export function resolveGateCommand(packName: string, gateCmd: string): string {
  if (packName === 'rust') {
    return gateCmd;
  }

  if (packName === 'cpp') {
    const hasCMake = existsSync(join(process.cwd(), 'CMakeLists.txt'));
    
    if (hasCMake) {
      if (gateCmd.startsWith('g++')) {
        return 'cmake -B build -S . && cmake --build build';
      }
      if (gateCmd.startsWith('ctest') || gateCmd.includes('tests')) {
        return 'ctest --test-dir build --output-on-failure';
      }
      if (gateCmd.startsWith('clang-tidy')) {
        // Run on src dir, using compile_commands.json in build
        return 'clang-tidy src/*.cpp -p build';
      }
      // Provide a generic fallback for other C++ commands if needed
    }
  }

  return gateCmd;
}

export async function runGates(packs: string[], customGates?: Record<string, string>): Promise<GateReport> {
  const report: GateReport = {
    timestamp: new Date().toISOString(),
    success: true,
    results: [],
  };

  log.banner('QUALITY GATES');

  for (const packName of packs) {
    const pack = loadPack(packName);
    if (!pack) continue;

    console.log();
    log.heading(`Running ${pack.displayName} gates...`);

    for (const gate of pack.gates) {
      const resolvedCmd = resolveGateCommand(packName, gate.cmd);
      const spinner = log.createSpinner(`[${packName}] ${gate.name}...`).start();

      const result = await runCommandAsync(resolvedCmd);

      const gateResult: GateResult = {
        name: gate.name,
        packName,
        success: result.success,
        durationMs: result.durationMs,
        stdout: result.stdout,
        stderr: result.stderr,
        command: resolvedCmd,
      };

      report.results.push(gateResult);

      const durationStr = (result.durationMs / 1000).toFixed(2);

      if (result.success) {
        spinner.succeed(`[${packName}] ${gate.name} passed (${durationStr}s)`);
      } else {
        spinner.fail(`[${packName}] ${gate.name} failed (${durationStr}s)`);
        report.success = false;

        // Print error output
        console.log('');
        log.error('Gate output:');
        console.log(result.stderr || result.stdout || '(No output)');
        console.log('');

        // Fast fail: stop running further gates
        break;
      }
    }

    if (!report.success) {
      break;
    }
  }

  // Run custom gates (defined in .sysvibe.toml [gates.custom])
  if (report.success && customGates && Object.keys(customGates).length > 0) {
    console.log();
    log.heading('Running custom gates...');

    for (const [gateName, gateCmd] of Object.entries(customGates)) {
      const spinner = log.createSpinner(`[custom] ${gateName}...`).start();

      const result = await runCommandAsync(gateCmd);

      const gateResult: GateResult = {
        name: gateName,
        packName: 'custom',
        success: result.success,
        durationMs: result.durationMs,
        stdout: result.stdout,
        stderr: result.stderr,
        command: gateCmd,
      };

      report.results.push(gateResult);

      const durationStr = (result.durationMs / 1000).toFixed(2);

      if (result.success) {
        spinner.succeed(`[custom] ${gateName} passed (${durationStr}s)`);
      } else {
        spinner.fail(`[custom] ${gateName} failed (${durationStr}s)`);
        report.success = false;

        console.log('');
        log.error('Gate output:');
        console.log(result.stderr || result.stdout || '(No output)');
        console.log('');

        break;
      }
    }
  }

  return report;
}

export function saveGateReport(report: GateReport): void {
  const dir = join(process.cwd(), '.sysvibe');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const file = join(dir, 'last_run.json');
  writeFileSync(file, JSON.stringify(report, null, 2), 'utf-8');
}
