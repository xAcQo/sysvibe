import { execSync, exec } from 'child_process';
import { platform } from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export function runCommand(cmd: string): CommandResult {
  const start = performance.now();
  try {
    const stdout = execSync(cmd, {
      encoding: 'utf-8',
      timeout: 15000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const durationMs = performance.now() - start;
    return { success: true, stdout: stdout.trim(), stderr: '', durationMs };
  } catch (err: unknown) {
    const durationMs = performance.now() - start;
    const error = err as { stdout?: string; stderr?: string };
    return {
      success: false,
      stdout: (error.stdout ?? '').toString().trim(),
      stderr: (error.stderr ?? '').toString().trim(),
      durationMs,
    };
  }
}

export async function runCommandAsync(cmd: string, cwd: string = process.cwd()): Promise<CommandResult> {
  const start = performance.now();
  try {
    const { stdout, stderr } = await execAsync(cmd, { cwd });
    const durationMs = performance.now() - start;
    return {
      success: true,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      durationMs,
    };
  } catch (err: unknown) {
    const durationMs = performance.now() - start;
    const error = err as { stdout?: string; stderr?: string };
    return {
      success: false,
      stdout: (error.stdout ?? '').toString().trim(),
      stderr: (error.stderr ?? '').toString().trim(),
      durationMs,
    };
  }
}

export function commandExists(cmd: string): boolean {
  const checkCmd = platform() === 'win32' ? `where ${cmd}` : `which ${cmd}`;
  const result = runCommand(checkCmd);
  return result.success;
}

export function getCommandVersion(cmd: string, versionFlag = '--version'): string | null {
  const result = runCommand(`${cmd} ${versionFlag}`);
  if (!result.success) return null;

  const output = result.stdout || result.stderr;
  // Extract version number patterns like 1.2.3, 13.2.0, etc.
  const match = output.match(/(\d+\.\d+(?:\.\d+)?)/);
  return match ? match[1] : null;
}
