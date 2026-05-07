# Project Retrospective

## Milestone: v1.0 — MVP

**Shipped:** 2026-05-07
**Phases:** 4 | **Plans:** 8

### What Was Built
- Core CLI framework, config management (`sysvibe init`), and agent detection
- Language packs for C++ and Rust, including idiomatic rules and anti-patterns
- Project template scaffolding engine (CMake and Cargo)
- Sequential quality gate pipeline (`sysvibe check`) with fail-fast execution
- AI-driven auto-fix loop (`sysvibe fix`) with generated constraint-bound prompts

### What Worked
- **Modular CLI Architecture:** Using Commander.js with separate command files kept the codebase clean.
- **Fail-Fast Gates:** Stopping execution on compilation errors before running linters saves significant time and prevents cascading phantom errors.
- **Developer-Driven Auto-Fix:** Generating `.sysvibe/fix-prompt.md` avoids the complexity of trying to inject text into GUI agents like Cursor while remaining highly effective.

### What Was Inefficient
- **Build System Translation:** Hardcoded shell commands for C++ `g++` compilation break easily on complex projects. Translating them to `cmake` build hooks was necessary but added complexity to the gate runner.

### Patterns Established
- `.sysvibe.toml` as the single source of truth for project config.
- `<!-- SYSVIBE START -->` and `<!-- SYSVIBE END -->` markers for safe, idempotent rule injection across diverse agent config formats.

### Key Lessons
- AI Agents are highly susceptible to "forgetting" instructions during an auto-fix loop if the error context is too large. The fix prompt must explicitly re-state the SysVibe rule constraints to prevent regressions.

---

## Milestone: v2.0 — Extended Language Support

**Shipped:** 2026-05-07
**Phases:** 4 | **Plans:** 4

### What Was Built
- Go, Zig, and C language packs with templates and robust quality gates
- Multi-language combo support for complex polyglot projects
- `sysvibe eject` command for clean uninstallation
- Custom gate definitions via `.sysvibe.toml` for extended user testing

### What Worked
- **Packs Architecture:** The core structure built in v1.0 scaled perfectly to add 3 new languages without touching core execution logic.
- **Sequential Tool Invocation:** The gate runner naturally supported custom gates running after language-specific gates with no complex scheduling.

### What Was Inefficient
- **Local Toolchain Reliance:** Relying on the user's host environment (e.g. `g++`, `golangci-lint` missing) means tests fail gracefully but we can't fully run all gates on machines lacking the toolchains.

### Patterns Established
- Merged rules without scaffolding for combo projects, avoiding directory structure conflicts.
- Custom user-defined quality checks in `.sysvibe.toml` mapped as pseudo-language packs.

### Key Lessons
- Advanced CLI features (like eject) require safely parsing and preserving user comments around generated text blocks, proving the value of strict `<!-- SYSVIBE START/END -->` tagging.

---

## Cross-Milestone Trends

*(Data will populate after v1.1)*
