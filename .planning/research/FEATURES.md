# Features Research: SysVibe

## Table Stakes (Must Have or Users Leave)

### Core CLI
- **One-command install** — `npx sysvibe` must work. Period.
- **Project initialization** — `sysvibe init` with interactive language pack selection
- **Agent auto-detection** — Detect which AI agent is running and generate correct config
- **Per-project config** — `.sysvibe.toml` tracks active packs, gate settings

### Language Packs
- **Rules/prompts** — Language-specific CLAUDE.md/AGENTS.md content that teaches the agent idioms
- **Quality gates** — Compilation, linting, sanitizer checks as executable scripts
- **Anti-patterns** — Explicit "never do this" rules the agent must follow
- **Idiom guides** — "Always use smart pointers, never raw new/delete" etc.

### Quality Gate Pipeline
- **`sysvibe check`** — Run the full pipeline with clear pass/fail output
- **Human-readable output** — Not raw compiler dumps, but structured results
- **Exit codes** — Standard 0/1 for CI integration

## Differentiators (Competitive Advantage)

### Auto-Fix Loop
- Run gates → capture failures → feed back to AI agent → re-run until clean
- This is the killer feature nobody else has
- Sets SysVibe apart from being "just a prompt pack"

### Multi-Language Combos
- C++ with Python bindings (pybind11 patterns)
- Rust with Python bindings (PyO3 patterns)
- C++ with Rust FFI (foreign function interface)
- Combo packs provide glue-layer rules and FFI-specific quality checks

### Few-Shot Examples
- Curated examples of correct vs incorrect patterns
- "AI writes this → SysVibe fixes it to this"
- Language-specific, not generic

### Project Templates
- CMake-based C++ project scaffolding (modern CMake, not legacy)
- Cargo-based Rust project scaffolding
- Pre-configured with quality gates active

## Anti-Features (Things to NOT Build)

- **IDE plugin** — Works through agent config files, not IDE extensions. Stays simple.
- **Build system** — SysVibe is NOT a build system. It invokes existing tools.
- **Language server** — Not competing with clangd or rust-analyzer
- **Code formatter** — Use clang-format/rustfmt directly, SysVibe just enforces they run
- **Dependency manager** — Not competing with Conan, vcpkg, or Cargo

## Feature Dependencies

```
sysvibe init → generates .sysvibe.toml → used by sysvibe check
language packs → installed during init → rules injected into agent config
quality gates → defined per pack → executed by sysvibe check
auto-fix loop → depends on quality gates + agent config → feeds errors back
```

## Complexity Estimates

| Feature | Complexity | Notes |
|---------|------------|-------|
| CLI framework + init | Medium | Commander.js + Inquirer.js, well-documented |
| Agent detection + config gen | Medium | Need to handle 5 different config formats |
| C++ quality gates | High | CMake integration, compile_commands.json generation |
| Rust quality gates | Low-Medium | Cargo handles everything, just invoke subcommands |
| Auto-fix loop | High | Need to parse compiler/linter output, format for AI |
| Multi-language combos | High | FFI-specific rules, complex interaction patterns |
| Project templates | Low | File copying + variable substitution |
