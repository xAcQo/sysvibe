# Phase 8: Advanced CLI Features - Context

**Domain:** Adding `sysvibe eject`, custom gate definitions in TOML, and multi-language combo pack support.

## Canonical Refs
*(None specified yet)*

## Decisions Captured

### Eject Mechanism
- **Decision:** Safe Extraction. Parse the agent config file, find the `<!-- SYSVIBE START -->` and `<!-- SYSVIBE END -->` tags, and remove only that block, preserving custom user rules.

### Custom Gates
- **Decision:** Alongside (Additions). When custom gates are defined in `.sysvibe.toml`, run them *in addition* to the default language gates.

### Combo Project Scaffolding
- **Decision:** Disable combo scaffolding. If a user selects multiple languages and attempts to use `--template`, throw an error or gracefully disable scaffolding. Combo projects should only inject merged rules, leaving folder structure to the user.

## Deferred Ideas
*(None)*
