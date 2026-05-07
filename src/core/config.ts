import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import TOML from '@iarna/toml';

export interface CppGateConfig {
  standard: string;
  compiler: string;
}

export interface RustGateConfig {
  nightly: boolean;
}

export interface GatesConfig {
  max_retries: number;
  skip?: string[];
  cpp?: CppGateConfig;
  rust?: RustGateConfig;
  custom?: Record<string, string>;
}

export interface AgentConfig {
  type: string;
  config_file: string;
}

export interface PacksConfig {
  active: string[];
}

export interface SysVibeConfig {
  packs: PacksConfig;
  agent: AgentConfig;
  gates: GatesConfig;
}

const CONFIG_FILE = '.sysvibe.toml';

export function getConfigPath(): string {
  return join(process.cwd(), CONFIG_FILE);
}

export function configExists(): boolean {
  return existsSync(getConfigPath());
}

export function readConfig(): SysVibeConfig {
  const content = readFileSync(getConfigPath(), 'utf-8');
  return TOML.parse(content) as unknown as SysVibeConfig;
}

export function writeConfig(config: SysVibeConfig): void {
  const content = TOML.stringify(config as unknown as TOML.JsonMap);
  writeFileSync(getConfigPath(), content, 'utf-8');
}

export function createDefaultConfig(
  packs: string[],
  agentType: string,
  agentConfigFile: string
): SysVibeConfig {
  const config: SysVibeConfig = {
    packs: { active: packs },
    agent: { type: agentType, config_file: agentConfigFile },
    gates: { max_retries: 3 },
  };

  if (packs.includes('cpp')) {
    config.gates.cpp = { standard: 'c++17', compiler: 'g++' };
  }
  if (packs.includes('rust')) {
    config.gates.rust = { nightly: false };
  }

  return config;
}

export function addPack(pack: string): void {
  const config = readConfig();
  if (!config.packs.active.includes(pack)) {
    config.packs.active.push(pack);

    // Add default gate config for the new pack
    if (pack === 'cpp' && !config.gates.cpp) {
      config.gates.cpp = { standard: 'c++17', compiler: 'g++' };
    }
    if (pack === 'rust' && !config.gates.rust) {
      config.gates.rust = { nightly: false };
    }

    writeConfig(config);
  }
}
