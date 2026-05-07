---
wave: 1
depends_on: []
files_modified:
  - src/core/config.ts
  - src/commands/eject.ts
  - src/index.ts
  - src/core/gate-runner.ts
  - src/commands/init.ts
autonomous: true
requirements:
  - ADV-01
  - ADV-02
  - ADV-03
---

# Phase 8: Advanced CLI Features Plan

## Goal
Implement `sysvibe eject`, support custom gates in `.sysvibe.toml`, and handle multi-language combo project initialization.

## Tasks

```xml
<task id="adv-config-update" type="execute">
  <action>
    Update src/core/config.ts to support custom gates in the SysVibeConfig interface.
    Add a `custom` property to `GatesConfig` which is a record of command strings.
  </action>
  <acceptance_criteria>
    - `SysVibeConfig` includes `gates.custom`.
    - TOML parsing correctly handles custom gates.
  </acceptance_criteria>
</task>

<task id="adv-eject-cmd" type="execute">
  <action>
    Create src/commands/eject.ts implementing the `eject` command.
    The command should:
    1. Read the agent config file specified in `.sysvibe.toml`.
    2. Remove the block between `<!-- SYSVIBE START -->` and `<!-- SYSVIBE END -->`.
    3. Update the file on disk.
    4. Remove `.sysvibe.toml`.
  </action>
  <acceptance_criteria>
    - `sysvibe eject` successfully removes SysVibe blocks from GEMINI.md/AGENTS.md.
    - User-added content in those files is preserved.
    - `.sysvibe.toml` is deleted.
  </acceptance_criteria>
</task>

<task id="adv-register-eject" type="execute">
  <action>
    Update src/index.ts to register the `eject` command.
  </action>
  <acceptance_criteria>
    - `sysvibe eject` is visible in `sysvibe --help`.
  </acceptance_criteria>
</task>

<task id="adv-custom-gates" type="execute">
  <action>
    Update src/core/gate-runner.ts to execute custom gates defined in the config.
    Custom gates should run after language-specific gates.
  </action>
  <acceptance_criteria>
    - `sysvibe check` runs both default gates and any gates defined in `gates.custom`.
  </acceptance_criteria>
</task>

<task id="adv-combo-init" type="execute">
  <action>
    Update src/commands/init.ts to handle multi-language scenarios.
    If more than one language is selected AND `--template` is provided, show a warning and disable scaffolding.
  </action>
  <acceptance_criteria>
    - `sysvibe init cpp rust --template cpp` shows a warning and does not scaffold files.
  </acceptance_criteria>
</task>
```

## Verification
- Run `sysvibe init --template go`.
- Add a custom gate to `.sysvibe.toml`.
- Run `sysvibe check` and verify the custom gate runs.
- Run `sysvibe eject` and verify the config and rule blocks are gone, but the file remains.
- Test combo init with multiple languages and a template flag.
