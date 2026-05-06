import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { AgentType } from './agent-detect.js';
import { getPackRules } from './pack-manager.js';

const MARKDOWN_START = '<!-- SYSVIBE START -->';
const MARKDOWN_END = '<!-- SYSVIBE END -->';
const PLAINTEXT_START = '# --- SYSVIBE START ---';
const PLAINTEXT_END = '# --- SYSVIBE END ---';

function isPlainTextFormat(configFile: string): boolean {
  return configFile === '.cursorrules';
}

function wrapWithMarkers(content: string, plainText: boolean): string {
  const start = plainText ? PLAINTEXT_START : MARKDOWN_START;
  const end = plainText ? PLAINTEXT_END : MARKDOWN_END;
  return `${start}\n${content}\n${end}`;
}

function removeSysVibeSectionFromContent(content: string, plainText: boolean): string {
  const start = plainText ? PLAINTEXT_START : MARKDOWN_START;
  const end = plainText ? PLAINTEXT_END : MARKDOWN_END;

  const startIdx = content.indexOf(start);
  const endIdx = content.indexOf(end);

  if (startIdx === -1 || endIdx === -1) return content;

  const before = content.substring(0, startIdx).trimEnd();
  const after = content.substring(endIdx + end.length).trimStart();

  return before + (after ? '\n\n' + after : '');
}

function buildHeader(packs: string[]): string {
  const packNames = packs.map((p) => p === 'cpp' ? 'C++' : p.charAt(0).toUpperCase() + p.slice(1));
  return `# SysVibe Quality Rules\n\n**Active packs:** ${packNames.join(', ')}\n**Auto-generated** — do not edit this section manually. Run \`sysvibe init\` to regenerate.\n`;
}

export function generateAgentConfig(packs: string[], agentType: AgentType): void {
  const cwd = process.cwd();
  const rules = getPackRules(packs);
  const header = buildHeader(packs);
  const fullContent = header + '\n' + rules;

  // Determine the primary config file
  const configFileMap: Record<string, string> = {
    'claude-code': 'CLAUDE.md',
    'gemini-cli': 'GEMINI.md',
    'cursor': '.cursorrules',
    'openclaw': 'AGENTS.md',
    'codex': 'AGENTS.md',
    'unknown': 'AGENTS.md',
  };

  const primaryFile = configFileMap[agentType] ?? 'AGENTS.md';
  const primaryPath = join(cwd, primaryFile);
  const isPlain = isPlainTextFormat(primaryFile);

  // Write to primary agent config
  writeToAgentFile(primaryPath, fullContent, isPlain);

  // Always also write to AGENTS.md (universal standard) unless it's already the primary
  if (primaryFile !== 'AGENTS.md') {
    const agentsPath = join(cwd, 'AGENTS.md');
    writeToAgentFile(agentsPath, fullContent, false);
  }
}

function writeToAgentFile(filePath: string, content: string, plainText: boolean): void {
  const wrapped = wrapWithMarkers(content, plainText);

  if (existsSync(filePath)) {
    // Read existing, remove old SysVibe section, append new
    let existing = readFileSync(filePath, 'utf-8');
    existing = removeSysVibeSectionFromContent(existing, plainText);
    const updated = existing.trimEnd() + '\n\n' + wrapped + '\n';
    writeFileSync(filePath, updated, 'utf-8');
  } else {
    // Create new file with SysVibe section
    writeFileSync(filePath, wrapped + '\n', 'utf-8');
  }
}

export function removeSysVibeSection(filePath: string): void {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, 'utf-8');
  const isPlain = isPlainTextFormat(filePath);
  const cleaned = removeSysVibeSectionFromContent(content, isPlain);
  writeFileSync(filePath, cleaned, 'utf-8');
}
