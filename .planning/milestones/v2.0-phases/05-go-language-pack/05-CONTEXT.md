# Phase 5: Go Language Pack - Context

**Domain:** Building the Go language pack with idiomatic rules and golangci-lint quality gates.

## Canonical Refs
*(None specified yet)*

## Decisions Captured

### Rule Strictness
- **Decision:** Enforce strict idiomatic patterns (like wrapping errors with `%w`, forced interface usage, context passing).
- **Reasoning:** SysVibe's core value is forcing AI to write production-grade systems code, preventing "JS-flavored" code.

### Template Scaffolding
- **Decision:** Generate a full starter template (`go.mod` targeting a specific version and a `main.go` entry point).
- **Reasoning:** Provides a ready-to-run environment, mirroring the approach taken for C++ (CMake) and Rust (Cargo), avoiding the need for manual `go mod init`.

### Quality Gate Tuning
- **Decision:** Use an aggressive `golangci-lint` configuration, enabling extra linters like `errcheck`, `gosec`, and `gocyclo`.
- **Reasoning:** Catching edge cases and complexity issues aligns with the goal of high-quality AI-generated code.

## Deferred Ideas
*(None)*
