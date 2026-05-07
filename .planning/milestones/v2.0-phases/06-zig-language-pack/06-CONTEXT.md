# Phase 6: Zig Language Pack - Context

**Domain:** Building the Zig language pack with strict comptime and allocator rules.

## Canonical Refs
*(None specified yet)*

## Decisions Captured

### Allocator Enforcement
- **Decision:** Strict idiomatic approach. Force the AI to always explicitly accept and use a `std.mem.Allocator` parameter for anything that allocates memory, forbidding hidden globals.
- **Reasoning:** Zig's philosophy is "no hidden memory allocation", and SysVibe should enforce this strictly.

### Template Scaffolding
- **Decision:** Scaffold `build.zig` to default to `ReleaseSafe` optimization mode.
- **Reasoning:** Helps catch subtle Undefined Behavior during the `sysvibe check` gate while maintaining decent performance.

### Quality Gate Tuning
- **Decision:** Append strict checks like `-freference-trace` to `zig build test`.
- **Reasoning:** Provides the AI with detailed stack traces when memory leaks or use-after-free bugs occur.

## Deferred Ideas
*(None)*
