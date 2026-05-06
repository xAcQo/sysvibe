import { cppPack } from '../packs/cpp/index.js';
import { rustPack } from '../packs/rust/index.js';
import type { LanguagePack } from '../packs/cpp/index.js';

const PACKS: Record<string, LanguagePack> = {
  cpp: cppPack,
  rust: rustPack,
};

export function getAvailablePacks(): string[] {
  return Object.keys(PACKS);
}

export function getPackChoices(): Array<{ name: string; value: string; description: string }> {
  return Object.values(PACKS).map((pack) => ({
    name: pack.displayName,
    value: pack.name,
    description: pack.description,
  }));
}

export function loadPack(name: string): LanguagePack | null {
  return PACKS[name] ?? null;
}

export function isValidPack(name: string): boolean {
  return name in PACKS;
}

export function getPackRules(packs: string[]): string {
  const rules: string[] = [];

  for (const packName of packs) {
    const pack = PACKS[packName];
    if (pack) {
      rules.push(pack.rulesContent);
    }
  }

  return rules.join('\n');
}

export function getPackDisplayName(name: string): string {
  return PACKS[name]?.displayName ?? name;
}
