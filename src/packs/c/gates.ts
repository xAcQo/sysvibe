import type { GateDefinition } from '../cpp/index.js';

export const cGates: GateDefinition[] = [
  {
    name: 'Compile (CMake)',
    description: 'Compile the project with strict C17 warnings',
    cmd: 'cmake -B build -S . && cmake --build build',
  },
  {
    name: 'Lint (clang-tidy)',
    description: 'Run clang-tidy static analysis for deeper logic and memory checks',
    cmd: 'clang-tidy src/*.c -p build',
  },
];
