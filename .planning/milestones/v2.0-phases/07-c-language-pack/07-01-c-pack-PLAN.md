---
wave: 1
depends_on: []
files_modified:
  - src/packs/c/index.ts
  - src/packs/c/rules.ts
  - src/packs/c/gates.ts
  - src/templates/c/CMakeLists.txt
  - src/templates/c/src/main.c
  - src/core/pack-manager.ts
autonomous: true
requirements:
  - C-01
  - C-02
  - C-03
---

# Phase 7: C Language Pack Plan

## Goal
Build the C language pack enforcing C17, strict memory safety, opaque pointers, and `clang-tidy` integration via CMake.

## Tasks

```xml
<task id="c-rules" type="execute">
  <action>
    Create src/packs/c/rules.ts defining strict idiomatic C rules.
    Include rules enforcing:
    - Opaque pointers for encapsulation (hide struct definitions in .c files).
    - Always checking `malloc` returns and explicitly pairing them with `free`.
    - Using safer string functions (e.g., `snprintf` over `sprintf`, `strncpy` over `strcpy`).
    - Returning error codes and passing output variables via pointers.
  </action>
  <read_first>
    - src/packs/cpp/rules.ts
  </read_first>
  <acceptance_criteria>
    - `src/packs/c/rules.ts` exports a string array of rules containing "opaque pointer" and "malloc".
  </acceptance_criteria>
</task>

<task id="c-templates" type="execute">
  <action>
    Create the C starter template files in src/templates/c/.
    1. src/templates/c/CMakeLists.txt targeting C17, enabling `CMAKE_EXPORT_COMPILE_COMMANDS ON`, and setting `-Wall -Wextra -Werror -Wpedantic`.
    2. src/templates/c/src/main.c with a "Hello, SysVibe" entry point.
  </action>
  <read_first>
    - src/templates/cpp/CMakeLists.txt
  </read_first>
  <acceptance_criteria>
    - `src/templates/c/CMakeLists.txt` exists and sets `CMAKE_C_STANDARD 17`.
    - `src/templates/c/src/main.c` exists.
  </acceptance_criteria>
</task>

<task id="c-gates" type="execute">
  <action>
    Create src/packs/c/gates.ts implementing the quality gates for C.
    Configure two gates:
    1. "cmake -B build -S . && cmake --build build" (Compilation)
    2. "clang-tidy src/*.c -p build" (Static Analysis)
  </action>
  <read_first>
    - src/packs/cpp/gates.ts
    - src/core/gate-runner.ts
  </read_first>
  <acceptance_criteria>
    - `src/packs/c/gates.ts` exports an array of GateDefinition objects with compilation and clang-tidy commands.
  </acceptance_criteria>
</task>

<task id="c-pack-index" type="execute">
  <action>
    Create src/packs/c/index.ts to assemble and export the C pack (rules, gates, template name "c").
    Update src/core/pack-manager.ts to import and register the C pack.
  </action>
  <read_first>
    - src/core/pack-manager.ts
  </read_first>
  <acceptance_criteria>
    - `src/core/pack-manager.ts` exports the C pack alongside others.
  </acceptance_criteria>
</task>
```

## Verification
- Initialize a test C project using `node dist/index.js init --template c`.
- Verify the generated `CMakeLists.txt` sets C17.
- Run `node dist/index.js check` in the test project and ensure it executes the C gates.
