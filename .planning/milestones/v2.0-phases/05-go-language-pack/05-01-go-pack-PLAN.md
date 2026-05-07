---
wave: 1
depends_on: []
files_modified:
  - src/packs/go/index.ts
  - src/packs/go/rules.ts
  - src/packs/go/gates.ts
  - src/templates/go/go.mod
  - src/templates/go/main.go
  - src/templates/go/.golangci.yml
  - src/packs/index.ts
autonomous: true
requirements:
  - GO-01
  - GO-02
  - GO-03
  - GO-04
---

# Phase 5: Go Language Pack Plan

## Goal
Build the Go language pack with idiomatic rules, golangci-lint aggressive quality gates, and a full starter template.

## Tasks

```xml
<task id="go-rules" type="execute">
  <action>
    Create src/packs/go/rules.ts defining strict idiomatic Go rules.
    Include rules enforcing:
    - Error wrapping with %w (e.g., `fmt.Errorf("failed to load: %w", err)`)
    - Passing `context.Context` as the first argument in functions doing I/O
    - Returning interfaces and accepting structs where appropriate
    - Proper concurrency patterns (WaitGroup, channels)
  </action>
  <read_first>
    - src/packs/cpp/rules.ts
  </read_first>
  <acceptance_criteria>
    - `src/packs/go/rules.ts` exports a string array of rules containing "%w" and "context.Context".
  </acceptance_criteria>
</task>

<task id="go-templates" type="execute">
  <action>
    Create the Go starter template files in src/templates/go/.
    1. src/templates/go/go.mod targeting go 1.22 and module {{PROJECT_NAME}}.
    2. src/templates/go/main.go with a simple "Hello, SysVibe" entry point.
    3. src/templates/go/.golangci.yml configuring aggressive linters (errcheck, gosec, gocyclo, gofmt, govet).
  </action>
  <read_first>
    - src/templates/rust/Cargo.toml
  </read_first>
  <acceptance_criteria>
    - `src/templates/go/go.mod` contains `module {{PROJECT_NAME}}`.
    - `src/templates/go/.golangci.yml` contains `errcheck` and `gosec`.
  </acceptance_criteria>
</task>

<task id="go-gates" type="execute">
  <action>
    Create src/packs/go/gates.ts implementing the quality gates for Go.
    Configure three gates:
    1. "golangci-lint run"
    2. "go vet ./..."
    3. "go test -race ./..."
  </action>
  <read_first>
    - src/packs/rust/gates.ts
  </read_first>
  <acceptance_criteria>
    - `src/packs/go/gates.ts` exports an array of GateDefinition objects.
    - Gate commands include "golangci-lint run" and "go test -race ./...".
  </acceptance_criteria>
</task>

<task id="go-pack-index" type="execute">
  <action>
    Create src/packs/go/index.ts to assemble and export the Go pack (rules, gates, template name "go").
    Update src/packs/index.ts to import and register the Go pack.
  </action>
  <read_first>
    - src/packs/cpp/index.ts
    - src/packs/index.ts
  </read_first>
  <acceptance_criteria>
    - `src/packs/index.ts` exports the Go pack alongside C++ and Rust.
  </acceptance_criteria>
</task>
```

## Verification
- Initialize a test Go project using `node dist/index.js init --template go`.
- Verify the generated `go.mod` and `.golangci.yml` exist.
- Run `node dist/index.js check` in the test project and ensure it executes the Go gates.
