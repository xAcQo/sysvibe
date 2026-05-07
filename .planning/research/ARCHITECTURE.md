# Architecture Research: SysVibe

## System Components

```
┌─────────────────────────────────────────────────────┐
│                   sysvibe CLI                        │
│  (TypeScript/Node.js — installed via npx)            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌──────────────┐    │
│  │  Installer │  │  Checker  │  │ Config Gen   │    │
│  │  (init)    │  │  (check)  │  │ (agent rules)│    │
│  └─────┬─────┘  └─────┬─────┘  └──────┬───────┘    │
│        │              │               │             │
│  ┌─────▼──────────────▼───────────────▼─────────┐   │
│  │              Pack Manager                     │   │
│  │  Loads/resolves language packs + combos       │   │
│  └─────────────────────┬─────────────────────────┘   │
│                        │                             │
│  ┌─────────────────────▼─────────────────────────┐   │
│  │              Quality Gate Runner               │   │
│  │  Executes gates in order, captures output      │   │
│  │  Feeds failures back for auto-fix loop         │   │
│  └────────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  Language Packs                      │
├──────────────┬──────────────┬───────────────────────┤
│   C++ Pack   │  Rust Pack   │  Combo Packs          │
│              │              │  (cpp-python,          │
│  rules/      │  rules/      │   rust-python,         │
│  idioms/     │  idioms/     │   cpp-rust)            │
│  gates/      │  gates/      │                       │
│  templates/  │  templates/  │                       │
│  anti-pats/  │  anti-pats/  │                       │
└──────────────┴──────────────┴───────────────────────┘
```

## Directory Structure (Installed Project)

```
my-project/
├── .sysvibe.toml           # Project config (active packs, gate settings)
├── .sysvibe/               # SysVibe local data
│   ├── packs/              # Installed language packs
│   │   ├── cpp/
│   │   └── rust/
│   └── cache/              # Gate results cache
├── CLAUDE.md               # Generated (or appended to) for Claude Code
├── GEMINI.md               # Generated for Gemini CLI
├── .cursorrules            # Generated for Cursor
├── AGENTS.md               # Generated for OpenClaw/Codex + universal standard
└── src/                    # User's code
```

## Directory Structure (npm Package)

```
sysvibe/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts            # CLI entry point
│   ├── commands/
│   │   ├── init.ts         # sysvibe init
│   │   ├── check.ts        # sysvibe check
│   │   ├── add.ts          # sysvibe add <pack>
│   │   └── fix.ts          # sysvibe fix (auto-fix loop)
│   ├── core/
│   │   ├── config.ts       # .sysvibe.toml read/write
│   │   ├── pack-manager.ts # Load, resolve, install packs
│   │   ├── gate-runner.ts  # Execute quality gates
│   │   ├── agent-detect.ts # Detect AI agent type
│   │   └── config-gen.ts   # Generate agent config files
│   ├── packs/
│   │   ├── cpp/
│   │   │   ├── index.ts    # Pack manifest
│   │   │   ├── rules/      # Markdown rules for agents
│   │   │   ├── idioms/     # Idiom guide content
│   │   │   ├── gates/      # Gate definitions (what to run, how to parse)
│   │   │   ├── templates/  # Project scaffolding
│   │   │   └── anti-patterns/ # What to never do
│   │   ├── rust/
│   │   │   └── ...         # Same structure
│   │   └── combos/
│   │       ├── cpp-python/
│   │       └── rust-python/
│   └── utils/
│       ├── shell.ts        # Subprocess execution
│       ├── parser.ts       # Compiler/linter output parsing
│       └── logger.ts       # Chalk-based formatted output
├── templates/              # Project scaffolding templates
│   ├── cpp/
│   └── rust/
└── dist/                   # Compiled output
```

## Data Flow

```
1. sysvibe init
   User selects languages → Pack Manager loads packs
   → Config Gen detects agent → generates CLAUDE.md/AGENTS.md etc.
   → Creates .sysvibe.toml

2. sysvibe check
   Read .sysvibe.toml → Load active packs
   → Gate Runner executes gates in order:
     compile → lint → sanitize → test
   → Parse output → Format results → Print report
   → Exit 0 (pass) or 1 (fail)

3. sysvibe fix
   Run sysvibe check → If gates fail:
   → Parse error output → Format for AI agent
   → Inject into agent context (append to CLAUDE.md or similar)
   → Agent fixes code → Re-run sysvibe check
   → Loop until clean or max retries
```

## Build Order (Phase Dependencies)

1. **Core CLI framework** — Commander.js setup, argument parsing (no dependencies)
2. **Config system** — .sysvibe.toml read/write (depends on 1)
3. **Pack manager** — Load/resolve pack definitions (depends on 2)
4. **Agent detection + config gen** — Detect agent, generate configs (depends on 3)
5. **Quality gate runner** — Execute gates, parse output (depends on 3)
6. **C++ pack** — Rules, idioms, gates for C++ (depends on 3, 5)
7. **Rust pack** — Rules, idioms, gates for Rust (depends on 3, 5)
8. **Auto-fix loop** — Feed errors back to agent (depends on 5, 6, 7)
9. **Project templates** — Scaffolding for new projects (depends on 6, 7)
10. **Combo packs** — Multi-language glue (depends on 6, 7)
