import { cppRules } from './rules.js';

export interface GateDefinition {
  name: string;
  cmd: string;
  description: string;
}

export interface LanguagePack {
  name: string;
  displayName: string;
  description: string;
  rulesContent: string;
  gates: GateDefinition[];
}

export const cppPack: LanguagePack = {
  name: 'cpp',
  displayName: 'C++',
  description: 'Modern C++ (C++17+) with RAII, smart pointers, and sanitizer enforcement',
  rulesContent: cppRules,
  gates: [
    { name: 'compile', cmd: 'g++ -Wall -Werror -Wpedantic -std=c++17', description: 'Compile with strict warnings' },
    { name: 'lint', cmd: 'clang-tidy', description: 'Static analysis with clang-tidy' },
    { name: 'sanitize', cmd: '-fsanitize=address -g -fno-omit-frame-pointer', description: 'AddressSanitizer for memory safety' },
  ],
};
