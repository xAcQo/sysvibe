import type { LanguagePack } from '../cpp/index.js';
import { zigRules } from './rules.js';
import { zigGates } from './gates.js';

export const zigPack: LanguagePack = {
  name: 'zig',
  displayName: 'Zig',
  description: 'Strict comptime and allocator rules, ReleaseSafe check mode',
  rulesContent: zigRules,
  gates: zigGates,
};
