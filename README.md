<div align="center">
  <h1>SysVibe</h1>
  <p><b>Everything-Claude-Code, but for Systems Languages.</b></p>
  <p>
    <a href="https://www.npmjs.com/package/sysvibe"><img src="https://img.shields.io/npm/v/sysvibe.svg?style=flat-square" alt="NPM Version" /></a>
    <img src="https://img.shields.io/badge/Language-TypeScript-blue.svg?style=flat-square" alt="Language" />
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" />
  </p>
</div>

---

**SysVibe** is a modular framework that makes AI coding agents (Claude Code, Gemini CLI, Cursor, OpenClaw, Codex) significantly better at systems programming languages like **C++** and **Rust**. 

It works by injecting language-specific rules, idiom guides, quality gates, and anti-pattern enforcement into your AI agent's context, then verifying the output through an automated compile → lint → sanitize → test pipeline. 

When a developer uses an AI agent with SysVibe installed, the code produced must meet production-grade quality standards for the target systems language — not the JS-flavored, warning-riddled, unsafe code that AI agents produce by default.

---

## ⚡ Features

- **Multi-Agent Support**: Automatically detects and integrates with Claude Code, Gemini CLI, Cursor, OpenClaw, and Codex without overwriting existing configurations.
- **Language Packs**: Highly curated rulesets for C++ (modern C++17, RAII, smart pointers) and Rust (idiomatic error handling, safe borrowing).
- **Project Scaffolding**: Generate clean, structured project templates (CMake 3.20+ for C++, Cargo for Rust).
- **Quality Gates**: A fast-fail pipeline (`sysvibe check`) that automatically runs compilation warnings, linters (`clang-tidy`, `cargo clippy`), memory sanitizers (ASan), and tests.
- **AI Auto-Fix Loop**: Generates a constrained, context-rich prompt (`sysvibe fix`) from pipeline failures that explicitly guides your AI agent on how to resolve the issues without violating project rules.

---

## 🚀 Quick Start

### 1. Initialize SysVibe in your project
Run the interactive setup wizard in any directory:

```bash
npx sysvibe init
```

*Optionally scaffold a new project template simultaneously:*
```bash
npx sysvibe init --template cpp    # Scaffolds a CMake project
npx sysvibe init --template rust   # Scaffolds a Cargo project
```

SysVibe will:
1. Detect your active AI agent.
2. Ask you which language packs to install (C++ or Rust).
3. Safely inject the rules into your agent's configuration file (e.g., `CLAUDE.md`, `.cursorrules`).
4. Save your configuration to `.sysvibe.toml`.

### 2. Add Packs Later
If you want to add support for another language later on:
```bash
npx sysvibe add rust
```

### 3. Verify Code Quality
Once your AI agent generates some code, verify it meets production standards:

```bash
npx sysvibe check
```
This runs the quality gates sequentially (Compile → Lint → Sanitize → Test). It fails fast if any step breaks.

### 4. Auto-Fix Loop
If `sysvibe check` fails, run:

```bash
npx sysvibe fix
```
This will extract the exact error output, correlate it with the failed command, and generate a `.sysvibe/fix-prompt.md` file. Follow the CLI instructions to feed this prompt back into your AI agent to auto-fix the issue securely.

---

## 🛠️ Requirements

SysVibe is a Node.js CLI tool, but it invokes your system's native toolchains to verify code quality. Ensure you have the appropriate tools installed for the packs you use:

**For C++:**
- `g++` / `clang++`
- `clang-tidy`
- `cmake` (if using templates)

**For Rust:**
- `cargo`
- `clippy`
- `rustfmt`

---

## 🧠 Why SysVibe?

AI coding agents are predominantly trained on JavaScript/TypeScript. When asked to write C++ or Rust, they often produce code that compiles but violates idiomatic patterns, ignores memory safety, skips sanitizers, and generally writes "JS-flavored C++." 

There are incredible tools for general agent optimization (`everything-claude-code`) and workflow orchestration (`get-shit-done`), but **systems programming is completely underserved**. SysVibe fills this gap by enforcing structural quality over syntax.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
