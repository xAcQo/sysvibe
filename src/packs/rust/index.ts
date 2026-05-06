import { rustRules } from './rules.js';
import type { LanguagePack } from '../cpp/index.js';

export const rustPack: LanguagePack = {
  name: 'rust',
  displayName: 'Rust',
  description: 'Idiomatic Rust with proper error handling and clippy enforcement',
  rulesContent: rustRules,
  gates: [
    { name: 'lint', cmd: 'cargo clippy -- -D warnings', description: 'Clippy with deny warnings' },
    { name: 'format', cmd: 'cargo fmt --check', description: 'Format check with rustfmt' },
    { name: 'test', cmd: 'cargo test --all-targets', description: 'Run all tests' },
  ],
};
