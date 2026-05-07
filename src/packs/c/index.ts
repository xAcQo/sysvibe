import type { LanguagePack } from '../cpp/index.js';
import { cRules } from './rules.js';
import { cGates } from './gates.js';

export const cPack: LanguagePack = {
  name: 'c',
  displayName: 'C',
  description: 'Strict C17, memory safety checks, and clang-tidy analysis',
  rulesContent: cRules,
  gates: cGates,
};
