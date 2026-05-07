---
status: complete
phase: 08-advanced-cli-features
source: [08-01-advanced-cli-SUMMARY.md]
started: 2026-05-07T04:20:00Z
updated: 2026-05-07T04:20:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: Build from clean state with `npm run build`. The CLI binary at `dist/index.js` runs without errors. `node dist/index.js --help` shows all commands including the new `eject` command. No import/module resolution failures.
result: pass

### 2. Eject Command Visible in CLI Help
expected: Running `node dist/index.js --help` lists `eject` as a subcommand with description "Remove SysVibe rules from agent configs and delete .sysvibe.toml".
result: pass

### 3. Eject Removes SysVibe Blocks from Agent Config
expected: After running `sysvibe init` to set up a project, running `sysvibe eject` removes the `<!-- SYSVIBE START -->` / `<!-- SYSVIBE END -->` block from the agent config file (e.g., GEMINI.md). Any user-authored content outside the SysVibe block is preserved intact. `.sysvibe.toml` is deleted.
result: pass

### 4. Custom Gates Execute After Language Gates
expected: When `.sysvibe.toml` contains a `[gates.custom]` section with entries like `my_check = "echo hello"`, running `sysvibe check` executes the custom gate after all language-specific gates complete. The custom gate shows spinner output with `[custom] my_check` prefix and reports pass/fail.
result: pass

### 5. Combo Init Guard — Multi-Language + Template
expected: Running `sysvibe init cpp rust --template cpp` shows a warning about multi-language combo and does NOT scaffold any template files. Rules for both C++ and Rust are still injected into the agent config. Only single-language init with `--template` should scaffold.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
