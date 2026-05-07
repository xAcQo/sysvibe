import { csharpRules } from './rules.js';
import type { LanguagePack } from '../cpp/index.js';

export const csharpPack: LanguagePack = {
  name: 'csharp',
  displayName: 'C# (.NET)',
  description: 'Modern C# with strict nullability, pattern matching, and async enforcement',
  rulesContent: csharpRules,
  gates: [
    { name: 'format', cmd: 'dotnet format --verify-no-changes', description: 'Enforce code formatting' },
    { name: 'build', cmd: 'dotnet build -warnaserror', description: 'Strict compilation (warnings as errors)' },
    { name: 'test', cmd: 'dotnet test', description: 'Run unit tests' },
  ],
};
