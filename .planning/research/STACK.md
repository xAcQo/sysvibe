# Stack Research: SysVibe

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

**Important finding:** The industry is moving toward `AGENTS.md` as a cross-tool standard. SysVibe should generate both the agent-specific file AND an `AGENTS.md` for future-proofing.

### Quality Gate Toolchains (Invoked, Not Bundled)

SysVibe invokes these tools from the user's existing installation — never bundles compilers.

**C++ Toolchain:**
| Tool | Purpose | Invocation |
|------|---------|------------|
| g++ / clang++ | Compilation | `-Wall -Werror -Wpedantic -std=c++17` |
| clang-tidy | Linting | Requires `compile_commands.json` |
| AddressSanitizer | Memory safety | `-fsanitize=address -g -fno-omit-frame-pointer` |
| ThreadSanitizer | Thread safety | `-fsanitize=thread` |
| UBSan | Undefined behavior | `-fsanitize=undefined` |
| cppcheck | Static analysis | Additional static checks |

**Rust Toolchain:**
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
