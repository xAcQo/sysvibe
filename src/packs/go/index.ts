import type { LanguagePack } from '../cpp/index.js';
import { goRules } from './rules.js';
import { goGates } from './gates.js';

export const goPack: LanguagePack = {
  name: 'go',
  displayName: 'Go',
  description: 'Idiomatic rules, golangci-lint, go vet, and race detection',
  rulesContent: goRules,
  gates: goGates,
};
