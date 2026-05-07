# Research Summary: SysVibe

## Stack Decision
**TypeScript/Node.js** CLI distributed via **npm** (`npx sysvibe`). Uses Commander.js for commands, Inquirer.js for prompts, Chalk + Ora for terminal UX, tsup for bundling. Config stored in `.sysvibe.toml`. Generates agent-specific config files (CLAUDE.md, GEMINI.md, .cursorrules, AGENTS.md).

## Table Stakes
- One-command install (`npx sysvibe`)
- Interactive `sysvibe init` with language pack selection
- Agent auto-detection and config generation for 5 agents
- Quality gate pipeline (`sysvibe check`): compile → lint → sanitize → test
- C++ pack: smart pointer enforcement, -Wall -Werror, ASan, clang-tidy
- Rust pack: clippy -D warnings, cargo fmt --check, cargo test

## Key Differentiators
1. **Auto-fix loop** — Gate failures automatically fed back to AI agent, re-run until clean
2. **Multi-language combos** — FFI/binding patterns for C++/Python, Rust/Python, C++/Rust
3. **Language-specific idiom enforcement** — Not generic "write good code" but specific patterns (RAII, ownership, error handling)

## Critical Watch-Outs
1. Cross-platform compatibility (Windows paths, shell differences) — test from day one
2. Agent config file conflicts — append with section markers, never overwrite
3. Compiler output parsing fragility — use structured output formats (JSON/YAML)
4. Auto-fix infinite loops — hard retry limit + error hash tracking
5. Rules bloat — keep under 150 lines per agent file
6. Toolchain availability — verify tools exist before running gates

## Build Order
1. Core CLI framework → 2. Config system → 3. Pack manager → 4. Agent detection + config gen → 5. Gate runner → 6. C++ pack → 7. Rust pack → 8. Auto-fix loop → 9. Templates → 10. Combo packs
