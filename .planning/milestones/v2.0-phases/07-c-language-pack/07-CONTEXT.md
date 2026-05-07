# Phase 7: C Language Pack - Context

**Domain:** Building the C language pack with strict C11/C17 enforcement and memory safety rules.

## Canonical Refs
*(None specified yet)*

## Decisions Captured

### Build System Scaffolding
- **Decision:** Scaffold a `CMakeLists.txt` for the C project.
- **Reasoning:** Industry standard, cross-platform, handles dependencies easily, and generates `compile_commands.json` for `clang-tidy`.

### Quality Gate Strictness
- **Decision:** Aggressive checking. Use `-Wall -Wextra -Werror -Wpedantic -std=c17` during compilation, AND run `clang-tidy`.
- **Reasoning:** Maximize bug prevention and enforce modern C standards.

### Idiomatic Rules Focus
- **Decision:** Blend of strict memory safety and modern architecture.
- **Reasoning:** Enforce checks on `malloc` returns, paired `free`s, bounds-checked strings, alongside architectural patterns like opaque pointers for encapsulation.

## Deferred Ideas
*(None)*
