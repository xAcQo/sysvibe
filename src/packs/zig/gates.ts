import type { GateDefinition } from '../cpp/index.js';

export const zigGates: GateDefinition[] = [
  {
    name: 'Format (zig fmt)',
    description: 'Checks if all Zig files are properly formatted',
    cmd: 'zig fmt --check src/ build.zig',
  },
  {
    name: 'Test & Trace (zig build test)',
    description: 'Runs unit tests with strict reference tracing enabled',
    cmd: 'zig build test -freference-trace',
  },
];
