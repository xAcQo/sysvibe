<!-- GSD:project-start source:PROJECT.md -->
## Project

**SysVibe**

SysVibe is a modular framework that makes AI coding agents (Claude Code, Gemini CLI, Cursor, OpenClaw, Codex) significantly better at systems programming languages like C++ and Rust. It works by injecting language-specific rules, idiom guides, quality gates, and anti-pattern enforcement into your AI agent, then verifying the output through an automated compile → lint → sanitize → test pipeline. Think of it as "everything-claude-code, but for systems languages" — the gap nobody has filled yet.

**Core Value:** When a developer uses an AI agent with SysVibe installed, the code produced must meet production-grade quality standards for the target systems language — not the JS-flavored, warning-riddled, unsafe code that AI agents produce by default.

### Constraints

- **Tech stack**: TypeScript/Node.js for the CLI and installer — matches ecosystem standard (GSD, claude-mem all use Node)
- **Distribution**: npm package, installable via `npx sysvibe` — one-command setup
- **Agent compatibility**: Must generate correct config format for each supported agent (CLAUDE.md, GEMINI.md, .cursorrules, AGENTS.md, etc.)
- **Modularity**: Language packs must be independently installable — never force users to download packs they don't need
- **Zero runtime dependencies on target languages**: SysVibe's installer is Node.js, but the quality gates invoke the user's existing toolchain (g++, clang, cargo, etc.)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### CLI Framework (TypeScript/Node.js)
| Component | Choice | Rationale | Confidence |
|-----------|--------|-----------|------------|
| **Runtime** | Node.js 20+ LTS | Ecosystem standard for AI coding tools (GSD, claude-mem, everything-claude-code all use Node) | High |
| **Language** | TypeScript 5.x | Type safety, better maintainability, industry standard for CLI tools | High |
| **Command Parser** | Commander.js | Industry standard, mature, supports subcommands (`sysvibe init`, `sysvibe check`, `sysvibe add`) | High |
| **Interactive Prompts** | Inquirer.js | Best for multi-step CLI wizards (language selection, agent detection) | High |
| **Terminal Output** | Chalk + Ora | Colored output + spinners for async operations (quality gate runs) | High |
| **Bundler** | tsup | Fast TypeScript bundler, zero-config, ESM/CJS dual output | High |
| **Config Format** | TOML (.sysvibe.toml) | Human-readable, standard in systems programming (Cargo.toml, pyproject.toml) | Medium |
| **TOML Parser** | @iarna/toml | Mature, well-maintained TOML parser for Node.js | Medium |
### Distribution
| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Package Registry** | npm | Standard for JS ecosystem. Enables `npx sysvibe` one-command install |
| **Package Name** | `sysvibe` | Short, memorable, available (verify before publish) |
| **Binary Entry** | `sysvibe` via `bin` field in package.json | Standard npx pattern |
### Agent Config Generation
| Agent | Config File | Format |
|-------|-------------|--------|
| Claude Code | `CLAUDE.md` | Markdown with rules |
| Gemini CLI | `GEMINI.md` | Markdown with rules |
| Cursor | `.cursorrules` | Plain text rules |
| OpenClaw | `AGENTS.md` | Markdown (emerging standard) |
| Codex | `AGENTS.md` | Markdown |
### Quality Gate Toolchains (Invoked, Not Bundled)
| Tool | Purpose | Invocation |
|------|---------|------------|
| g++ / clang++ | Compilation | `-Wall -Werror -Wpedantic -std=c++17` |
| clang-tidy | Linting | Requires `compile_commands.json` |
| AddressSanitizer | Memory safety | `-fsanitize=address -g -fno-omit-frame-pointer` |
| ThreadSanitizer | Thread safety | `-fsanitize=thread` |
| UBSan | Undefined behavior | `-fsanitize=undefined` |
| cppcheck | Static analysis | Additional static checks |
| Tool | Purpose | Invocation |
|------|---------|------------|
| cargo build | Compilation | `--release` for production checks |
| cargo clippy | Linting | `-- -D warnings` (deny all warnings) |
| cargo fmt | Formatting | `--check` for CI mode |
| cargo test | Testing | `--all-targets --all-features` |
| Miri | UB detection | `cargo +nightly miri run` (optional, nightly only) |
## What NOT to Use
- **Deno/Bun** — Lower ecosystem adoption for CLI tools, npm compatibility issues
- **Python (pip)** — Less seamless install than npx, virtual environment friction
- **Rust/Go for the CLI** — Impressive but harder to distribute, npm is the standard
- **Webpack** — Overkill for CLI bundling, tsup is simpler and faster
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

<!-- SYSVIBE START -->
# SysVibe Quality Rules

**Active packs:** C++, Rust
**Auto-generated** — do not edit this section manually. Run `sysvibe init` to regenerate.

## C++ Rules (SysVibe)

### Memory Management
- **ALWAYS** use `std::unique_ptr` or `std::shared_ptr` for heap allocations
- **NEVER** use raw `new` / `delete` — smart pointers handle cleanup automatically
- **ALWAYS** follow RAII: acquire resources in constructors, release in destructors
- **NEVER** manually manage memory when smart pointers or containers work

### Modern C++ Standards
- **ALWAYS** compile with `-Wall -Werror -Wpedantic -std=c++17`
- **ALWAYS** use `std::string`, `std::vector`, `std::array` — never C-style arrays or `char*`
- **ALWAYS** use `auto` for complex iterator types and lambda return types
- **ALWAYS** use range-based for loops (`for (const auto& item : container)`)
- **NEVER** ignore compiler warnings — they indicate real bugs

### Error Handling
- **ALWAYS** handle error cases explicitly — no silent failures
- **ALWAYS** use exceptions or `std::optional`/`std::expected` for recoverable errors
- **NEVER** use error codes without checking them

### Concurrency
- **ALWAYS** use `std::mutex` with `std::lock_guard` or `std::scoped_lock`
- **NEVER** manually lock/unlock mutexes (use RAII wrappers)

### Example: Wrong vs Right

```cpp
// ❌ WRONG — raw pointer, manual memory management
Widget* createWidget() {
    Widget* w = new Widget();
    w->init();
    return w;  // Who deletes this? Memory leak risk!
}

// ✅ RIGHT — smart pointer, automatic cleanup
std::unique_ptr<Widget> createWidget() {
    auto w = std::make_unique<Widget>();
    w->init();
    return w;  // Ownership is clear, cleanup is automatic
}
```

## Rust Rules (SysVibe)

### Error Handling
- **ALWAYS** use the `?` operator for error propagation
- **NEVER** use `.unwrap()` in production code — use `.expect("reason")` only in tests or with guaranteed values
- **ALWAYS** implement proper error types with `thiserror` or use `anyhow` for applications
- **ALWAYS** handle `Result` and `Option` explicitly — no silent discards

### Idiomatic Patterns
- **ALWAYS** run `cargo clippy -- -D warnings` before committing
- **ALWAYS** run `cargo fmt --check` before committing
- **NEVER** use excessive `.clone()` to satisfy the borrow checker — restructure ownership instead
- **ALWAYS** prefer iterators over manual indexing (`.iter().map().collect()`)
- **ALWAYS** use pattern matching exhaustively — never use catch-all `_` unless intentional

### Safety
- **NEVER** use `unsafe` blocks unless absolutely necessary
- **ALWAYS** add a `// SAFETY: ...` comment explaining why `unsafe` is sound when used
- **ALWAYS** minimize the scope of `unsafe` blocks

### Testing
- **ALWAYS** write `#[cfg(test)]` module with unit tests
- **ALWAYS** test error paths, not just the happy path
- **ALWAYS** use `#[should_panic]` for expected panics in tests

### Example: Wrong vs Right

```rust
// ❌ WRONG — .unwrap() will panic on error
fn read_config() -> Config {
    let content = std::fs::read_to_string("config.toml").unwrap();
    let config: Config = toml::from_str(&content).unwrap();
    config
}

// ✅ RIGHT — proper error propagation with ?
fn read_config() -> Result<Config, Box<dyn std::error::Error>> {
    let content = std::fs::read_to_string("config.toml")?;
    let config: Config = toml::from_str(&content)?;
    Ok(config)
}
```

<!-- SYSVIBE END -->
