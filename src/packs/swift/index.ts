import { swiftRules } from './rules.js';
import type { LanguagePack } from '../cpp/index.js';

export const swiftPack: LanguagePack = {
  name: 'swift',
  displayName: 'Swift',
  description: 'Modern Swift with value semantics, strict unwrapping, and async/await',
  rulesContent: swiftRules,
  gates: [
    { name: 'lint', cmd: 'swiftlint strict', description: 'SwiftLint strict mode' },
    { name: 'build', cmd: 'swift build -Xswiftc -warnings-as-errors', description: 'Strict compilation' },
    { name: 'test', cmd: 'swift test', description: 'Run XCTest suite' },
  ],
};
