# Pitfalls Research: SysVibe

## Critical Pitfalls

### 1. Compiler Output Parsing is Fragile
**Warning signs:** Tests pass on one compiler version but fail on another. Gate runner breaks with minor clang/gcc version updates.
**Prevention:** Don't regex-parse raw compiler output. Use structured output formats where available:
- clang-tidy supports YAML output (`-export-fixes`)
- clippy supports JSON output (`--message-format=json`)
- Use exit codes as primary pass/fail, structured output for details
**Phase:** Quality Gate Runner (Phase 5)

### 2. Cross-Platform Path Handling (Windows vs Unix)
**Warning signs:** SysVibe works on Mac/Linux but fails on Windows. Path separators, shell invocation, and tool locations differ.
**Prevention:**
- Use Node.js `path` module everywhere (never hardcode `/` or `\`)
- Use `cross-spawn` npm package instead of `child_process.spawn` for Windows compatibility
- Test on Windows from day one (user is on Windows)
**Phase:** Core CLI Framework (Phase 1-2)

### 3. Agent Config File Conflicts
**Warning signs:** SysVibe overwrites user's existing CLAUDE.md or .cursorrules with its generated content.
**Prevention:**
- ALWAYS append to existing files, never overwrite
- Use clear section markers (e.g., `<!-- SYSVIBE START -->` / `<!-- SYSVIBE END -->`)
- Provide `sysvibe eject` to cleanly remove SysVibe sections
**Phase:** Agent Detection + Config Gen (Phase 4)

### 4. Assuming Toolchain Installation
**Warning signs:** User runs `sysvibe check` but doesn't have clang-tidy or cargo installed. Cryptic "command not found" errors.
**Prevention:**
- `sysvibe init` should verify toolchain availability: "Found: g++ 13.2, clang-tidy 17.0, cargo 1.75"
- Missing tools should be clear errors with install instructions, not crashes
- Make each gate optional/skippable if its tool isn't installed
**Phase:** Pack Manager (Phase 3)

### 5. Auto-Fix Loop Can Infinite Loop
**Warning signs:** AI agent makes a fix that introduces a new error, which the agent then "fixes" by reverting, creating an endless cycle.
**Prevention:**
- Hard limit on retry count (default: 3)
- Track error hashes — if same error repeats, abort with "unable to auto-fix"
- Show human-readable summary of what was tried
**Phase:** Auto-Fix Loop (Phase 8)

### 6. Rules Bloat Degrades Agent Performance
**Warning signs:** CLAUDE.md becomes 500+ lines of SysVibe rules, overwhelming the agent's context window.
**Prevention:**
- Keep generated rules under 150 lines per agent file
- Use concise, actionable rules (not essays)
- Research confirms: "bloated or redundant files can actually degrade agent performance"
**Phase:** Config Gen (Phase 4)

### 7. C++ Build System Fragmentation
**Warning signs:** SysVibe assumes CMake but user uses Meson, Bazel, or raw Makefiles. Quality gates fail because no `compile_commands.json` exists.
**Prevention:**
- Support multiple build systems, but start with CMake (most common)
- Provide `sysvibe check --compile-db <path>` for custom compile_commands.json locations
- Document how to generate compile_commands.json for each build system
**Phase:** C++ Pack (Phase 6)

### 8. npm Package Size Bloat
**Warning signs:** Package includes all language packs, templates, and examples. Install takes forever.
**Prevention:**
- Bundle only core + pack manifests in the main package
- Download pack content on-demand during `sysvibe init`
- Or keep it all in one package but lazy-load (simpler for v1)
**Phase:** Distribution (Phase 1)

## AI-Specific Pitfalls (Why This Tool Exists)

### AI Code Quality Issues SysVibe Must Catch

**C++ issues:**
- Raw `new`/`delete` instead of smart pointers
- Missing RAII patterns (manual resource management)
- Unclear ownership semantics
- No bounds checking on arrays
- Missing error handling on system calls
- Compiling without warnings enabled
- No sanitizer usage

**Rust issues:**
- Excessive `.unwrap()` instead of proper error handling with `?`
- Unnecessary `unsafe` blocks
- Fighting the borrow checker with excessive `.clone()`
- Not using `clippy` recommendations
- Ignoring `#[must_use]` patterns
- C-style coding patterns instead of idiomatic Rust

**Cross-language issues:**
- FFI boundary memory safety (who owns what across the boundary?)
- Type mismatches at FFI boundaries
- Missing null checks when crossing language boundaries
