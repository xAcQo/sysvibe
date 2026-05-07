---
wave: 1
depends_on: []
files_modified:
  - src/packs/zig/index.ts
  - src/packs/zig/rules.ts
  - src/packs/zig/gates.ts
  - src/templates/zig/build.zig
  - src/templates/zig/src/main.zig
  - src/core/pack-manager.ts
autonomous: true
requirements:
  - ZIG-01
  - ZIG-02
  - ZIG-03
  - ZIG-04
---

# Phase 6: Zig Language Pack Plan

## Goal
Build the Zig language pack with strict comptime and allocator rules, `ReleaseSafe` template scaffolding, and `-freference-trace` test gates.

## Tasks

```xml
<task id="zig-rules" type="execute">
  <action>
    Create src/packs/zig/rules.ts defining strict idiomatic Zig rules.
    Include rules enforcing:
    - Explicit `std.mem.Allocator` passing for anything that allocates memory (no implicit globals)
    - Correct usage of error unions (`!type`) and `try` / `catch`
    - Proper use of `comptime` for metaprogramming and type checks
    - Resource cleanup using `defer` and `errdefer`
  </action>
  <read_first>
    - src/packs/cpp/rules.ts
  </read_first>
  <acceptance_criteria>
    - `src/packs/zig/rules.ts` exports a string array of rules containing "std.mem.Allocator" and "comptime".
  </acceptance_criteria>
</task>

<task id="zig-templates" type="execute">
  <action>
    Create the Zig starter template files in src/templates/zig/.
    1. src/templates/zig/build.zig that builds an executable named "{{PROJECT_NAME}}".
       It MUST default the optimization mode to `ReleaseSafe` (e.g. `const optimize = b.standardOptimizeOption(.{ .preferred_optimize_mode = .ReleaseSafe });`).
    2. src/templates/zig/src/main.zig with a simple "Hello, SysVibe" entry point and an empty test block to ensure tests run.
  </action>
  <read_first>
    - src/templates/rust/Cargo.toml
  </read_first>
  <acceptance_criteria>
    - `src/templates/zig/build.zig` contains `.ReleaseSafe`.
    - `src/templates/zig/src/main.zig` exists.
  </acceptance_criteria>
</task>

<task id="zig-gates" type="execute">
  <action>
    Create src/packs/zig/gates.ts implementing the quality gates for Zig.
    Configure two gates:
    1. "zig fmt --check src/" or "zig fmt --check build.zig src/"
    2. "zig build test -freference-trace"
  </action>
  <read_first>
    - src/packs/rust/gates.ts
  </read_first>
  <acceptance_criteria>
    - `src/packs/zig/gates.ts` exports an array of GateDefinition objects.
    - Gate commands include "zig fmt --check" and "zig build test -freference-trace".
  </acceptance_criteria>
</task>

<task id="zig-pack-index" type="execute">
  <action>
    Create src/packs/zig/index.ts to assemble and export the Zig pack (rules, gates, template name "zig").
    Update src/core/pack-manager.ts to import and register the Zig pack in the PACKS record.
  </action>
  <read_first>
    - src/packs/cpp/index.ts
    - src/core/pack-manager.ts
  </read_first>
  <acceptance_criteria>
    - `src/core/pack-manager.ts` exports the Zig pack alongside C++, Rust, and Go.
  </acceptance_criteria>
</task>
```

## Verification
- Initialize a test Zig project using `node dist/index.js init --template zig`.
- Verify the generated `build.zig` sets `ReleaseSafe`.
- Run `node dist/index.js check` in the test project and ensure it executes the Zig gates.
