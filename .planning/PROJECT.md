# SysVibe

## What This Is

SysVibe is a modular framework that makes AI coding agents (Claude Code, Gemini CLI, Cursor, OpenClaw, Codex) significantly better at systems programming languages like C++ and Rust. It works by injecting language-specific rules, idiom guides, quality gates, and anti-pattern enforcement into your AI agent, then verifying the output through an automated compile → lint → sanitize → test pipeline. Think of it as "everything-claude-code, but for systems languages" — the gap nobody has filled yet.

## Core Value

When a developer uses an AI agent with SysVibe installed, the code produced must meet production-grade quality standards for the target systems language — not the JS-flavored, warning-riddled, unsafe code that AI agents produce by default.

## Current State

**Shipped: v3.0 Pipeline Optimization & CI/CD**
SysVibe is now a functional Node.js CLI tool installable via `npx sysvibe`. It detects 5 major AI agents, injects highly-curated rules for C++, Rust, Go, Zig, C, **C#, Swift, and Java**. It scaffolds project templates, features CI/CD generation (`sysvibe init --ci`), runs quality gate pipelines (`sysvibe check`) with blazing fast caching, provides an automated feedback loop (`sysvibe fix`), supports multi-language combos securely, allows custom user-defined gates, and offers a clean `sysvibe eject` command.

<details>
<summary>Archived State (v2.0)</summary>
SysVibe is now a functional Node.js CLI tool installable via `npx sysvibe`. It successfully detects 5 major AI agents, injects highly-curated rules for C++, Rust, Go, Zig, and C without overwriting existing configs. It scaffolds project templates, runs quality gate pipelines (`sysvibe check`), provides an automated feedback loop (`sysvibe fix`), supports multi-language combos securely, allows custom user-defined gates, and offers a clean `sysvibe eject` command.
</details>

## Requirements

### Validated

- ✓ User can install SysVibe via `npx sysvibe` (one command) — v1.0
- ✓ User can initialize a project with `sysvibe init` and select language packs — v1.0
- ✓ User can install C++ language pack with rules, idioms, templates, and quality gates — v1.0
- ✓ User can install Rust language pack with rules, idioms, templates, and quality gates — v1.0
- ✓ SysVibe auto-detects the user's AI agent (Claude Code, Gemini CLI, Cursor, OpenClaw, Codex) and generates the correct config format — v1.0
- ✓ User can run `sysvibe check` to execute quality gate pipeline (compile → lint → sanitize → test) — v1.0
- ✓ Quality gate failures are automatically fed back to the AI agent for fixing — v1.0
- ✓ C++ pack enforces: smart pointers/RAII, -Wall -Werror -Wpedantic, AddressSanitizer, clang-tidy — v1.0
- ✓ Rust pack enforces: clippy (deny warnings), cargo fmt, cargo test, unsafe block justification — v1.0
- ✓ Per-project config via `.sysvibe.toml` tracks active packs and settings — v1.0
- ✓ Go language pack with golangci-lint, go vet, race detector — Phase 5
- ✓ Zig language pack with zig build quality checks — Phase 6
- ✓ C language pack with strict C11/C17 standards enforcement — Phase 7
- ✓ Multi-language combo support — Phase 8
- ✓ `sysvibe eject` cleanly removes all SysVibe sections from agent configs — Phase 8
- ✓ Custom gate definitions via `.sysvibe.toml` (user-defined quality checks) — Phase 8
- ✓ CI/CD integration templates (GitHub Actions, GitLab CI) — Phase 9
- ✓ Gate result caching (skip re-running unchanged files) — Phase 10
- ✓ C# (.NET) Language Pack with dotnet formatting/building/testing — Phase 11
- ✓ Swift Language Pack with swiftlint and async enforcement — Phase 12
- ✓ Java Language Pack with Maven/Gradle detection — Phase 13

### Active

- [ ] Support for Bazel build system

## Current Milestone: v4.0 Build System Integration & Expansion

**Goal:** Integrate SysVibe natively into enterprise build systems (like Bazel) and extend support for complex, monorepo-scale projects.

**Target features:**
- Bazel integration templates
- Monorepo package filtering
- Distributed gate execution

### Out of Scope

- IDE/editor plugins — SysVibe works through AI agent config files, not IDE extensions
- Model training/fine-tuning — SysVibe works at the prompt/rules layer, not the model layer
- Web framework support (React, Next.js, etc.) — Other tools already cover web; SysVibe is systems-only
- True automated child-process loop for GUI agents — Deferred indefinitely. GUI agents (Cursor) require developer-driven loops (e.g. `@.sysvibe/fix-prompt.md`) as they cannot be controlled via child process stdin.

## Context

**Problem:** AI coding agents (Claude, Gemini, GPT, etc.) are trained predominantly on JavaScript/TypeScript code. When asked to write C++ or Rust, they produce code that compiles but violates idiomatic patterns, ignores memory safety, skips sanitizers, and generally writes "JS-flavored C++." No existing tool addresses this — GSD handles workflow, UI/UX Pro Max handles design, claude-mem handles memory — but nobody handles systems language quality.

**Market gap:** The AI coding tools ecosystem has exploded (everything-claude-code: 175k stars, GSD: 60k stars) but every major tool focuses on web development workflow. Systems programming is completely underserved.

**Competitive landscape:**
- `everything-claude-code` — General agent optimization, no language-specific depth
- `ui-ux-pro-max-skill` — Design quality only
- `claude-mem` — Memory/context only
- `get-shit-done` — Workflow orchestration only
- **SysVibe** — Systems language quality enforcement (unique position)

**Reference architecture:** SysVibe follows the same modular skill/pack pattern proven by GSD and everything-claude-code. Users install a core + pick language-specific packs. Each pack contains rules, skills, templates, idiom guides, and verification scripts.

**Target users:**
- Developers frustrated that AI agents default to JS/TS patterns in systems code
- Students building portfolio projects in C++/Rust who need production-quality output
- Professional developers using AI assistants for systems programming tasks

## Constraints

- **Tech stack**: TypeScript/Node.js for the CLI and installer — matches ecosystem standard (GSD, claude-mem all use Node)
- **Distribution**: npm package, installable via `npx sysvibe` — one-command setup
- **Agent compatibility**: Must generate correct config format for each supported agent (CLAUDE.md, GEMINI.md, .cursorrules, AGENTS.md, etc.)
- **Modularity**: Language packs must be independently installable — never force users to download packs they don't need
- **Zero runtime dependencies on target languages**: SysVibe's installer is Node.js, but the quality gates invoke the user's existing toolchain (g++, clang, cargo, etc.)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| TypeScript/Node.js for SysVibe CLI | Matches ecosystem standard (GSD, claude-mem). Enables `npx` one-command install. | ✓ Good |
| C++ and Rust packs first | Highest demand, hardest for AI, biggest market gap | ✓ Good |
| Full pipeline (rules + verification + auto-fix loop) | Differentiates from prompt-only tools. Makes it a real framework, not just a config pack | ✓ Good |
| Multi-agent support from day one | Claude Code, Gemini CLI, Cursor, OpenClaw, Codex — cover the whole market | ✓ Good |
| npm distribution via `npx sysvibe` | One-command install like GSD. Lowest friction. | ✓ Good |
| Developer-driven fix loop for GUI agents | Cannot automate Cursor via CLI. Using a generated prompt file (`.sysvibe/fix-prompt.md`) is universal. | ✓ Good |
| CMake hook for C++ gates | Simple `g++` commands fail on real projects. Detecting CMake and translating commands is robust. | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-07 after Phase 13 (v3.0 completion)*
