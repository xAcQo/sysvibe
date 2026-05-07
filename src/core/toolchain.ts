import { commandExists, getCommandVersion } from '../utils/shell.js';
import * as log from '../utils/logger.js';

export interface ToolRequirement {
  cmd: string;
  versionFlag: string;
  installCmd: string;
  required: boolean;
  displayName?: string;
}

export interface ToolResult {
  cmd: string;
  found: boolean;
  version: string | null;
  required: boolean;
  installCmd: string;
}

export interface ToolchainReport {
  tools: ToolResult[];
  allRequiredFound: boolean;
  warnings: string[];
}

const TOOLCHAIN_REQUIREMENTS: Record<string, ToolRequirement[]> = {
  cpp: [
    {
      cmd: 'g++',
      versionFlag: '--version',
      installCmd: 'https://gcc.gnu.org/install/',
      required: true,
      displayName: 'g++',
    },
    {
      cmd: 'clang-tidy',
      versionFlag: '--version',
      installCmd: 'https://clang.llvm.org/extra/clang-tidy/',
      required: false,
      displayName: 'clang-tidy',
    },
    {
      cmd: 'cppcheck',
      versionFlag: '--version',
      installCmd: 'https://cppcheck.sourceforge.io/',
      required: false,
      displayName: 'cppcheck',
    },
  ],
  rust: [
    {
      cmd: 'cargo',
      versionFlag: '--version',
      installCmd: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      required: true,
      displayName: 'cargo',
    },
    {
      cmd: 'rustc',
      versionFlag: '--version',
      installCmd: '(installed with cargo via rustup)',
      required: true,
      displayName: 'rustc',
    },
  ],
  csharp: [
    {
      cmd: 'dotnet',
      versionFlag: '--version',
      installCmd: 'https://dotnet.microsoft.com/download',
      required: true,
      displayName: 'dotnet',
    },
  ],
  swift: [
    {
      cmd: 'swift',
      versionFlag: '--version',
      installCmd: 'https://swift.org/download/',
      required: true,
      displayName: 'swift',
    },
    {
      cmd: 'swiftlint',
      versionFlag: 'version',
      installCmd: 'brew install swiftlint',
      required: false,
      displayName: 'swiftlint',
    },
  ],
  java: [
    {
      cmd: 'javac',
      versionFlag: '-version',
      installCmd: 'https://adoptium.net/',
      required: true,
      displayName: 'javac',
    },
  ],
};

export function checkToolchain(packs: string[]): ToolchainReport {
  const tools: ToolResult[] = [];
  const warnings: string[] = [];
  let allRequiredFound = true;

  for (const pack of packs) {
    const requirements = TOOLCHAIN_REQUIREMENTS[pack];
    if (!requirements) continue;

    for (const req of requirements) {
      const found = commandExists(req.cmd);
      const version = found ? getCommandVersion(req.cmd, req.versionFlag) : null;

      tools.push({
        cmd: req.displayName ?? req.cmd,
        found,
        version,
        required: req.required,
        installCmd: req.installCmd,
      });

      if (!found && req.required) {
        allRequiredFound = false;
        const packName = pack === 'cpp' ? 'C++' : pack.charAt(0).toUpperCase() + pack.slice(1);
        warnings.push(`${packName} gates will be skipped until ${req.cmd} is installed.`);
      }
    }
  }

  return { tools, allRequiredFound, warnings };
}

export function printToolchainReport(report: ToolchainReport): void {
  log.heading('Checking toolchain...');

  for (const tool of report.tools) {
    if (tool.found) {
      log.toolFound(tool.cmd, tool.version ?? 'unknown');
    } else {
      log.toolMissing(tool.cmd, tool.installCmd);
    }
  }

  if (report.warnings.length > 0) {
    console.log('');
    for (const warning of report.warnings) {
      log.warn(warning);
    }
  }
}
