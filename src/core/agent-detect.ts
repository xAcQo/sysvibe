import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export type AgentType = 'claude-code' | 'gemini-cli' | 'cursor' | 'openclaw' | 'codex' | 'unknown';

export interface AgentDetection {
  type: AgentType;
  configFile: string;
  detected: boolean;
}

const AGENT_DISPLAY_NAMES: Record<AgentType, string> = {
  'claude-code': 'Claude Code',
  'gemini-cli': 'Gemini CLI',
  'cursor': 'Cursor',
  'openclaw': 'OpenClaw',
  'codex': 'Codex',
  'unknown': 'Unknown',
};

export function detectAgent(): AgentDetection {
  const cwd = process.cwd();
  const home = homedir();

  // Check for Claude Code
  if (
    existsSync(join(cwd, 'CLAUDE.md')) ||
    existsSync(join(home, '.claude', 'CLAUDE.md'))
  ) {
    return { type: 'claude-code', configFile: 'CLAUDE.md', detected: true };
  }

  // Check for Gemini CLI
  if (
    existsSync(join(cwd, 'GEMINI.md')) ||
    existsSync(join(home, '.gemini', 'GEMINI.md'))
  ) {
    return { type: 'gemini-cli', configFile: 'GEMINI.md', detected: true };
  }

  // Check for Cursor
  if (existsSync(join(cwd, '.cursorrules'))) {
    return { type: 'cursor', configFile: '.cursorrules', detected: true };
  }

  // Check for Codex
  if (existsSync(join(cwd, '.codex'))) {
    return { type: 'codex', configFile: 'AGENTS.md', detected: true };
  }

  // Check for OpenClaw or generic AGENTS.md
  if (existsSync(join(cwd, 'AGENTS.md'))) {
    return { type: 'openclaw', configFile: 'AGENTS.md', detected: true };
  }

  // Default to universal standard
  return { type: 'unknown', configFile: 'AGENTS.md', detected: false };
}

export function getAgentDisplayName(type: AgentType): string {
  return AGENT_DISPLAY_NAMES[type];
}
