export const rustRules = `## Rust Rules (SysVibe)

### Error Handling
- **ALWAYS** use the \`?\` operator for error propagation
- **NEVER** use \`.unwrap()\` in production code — use \`.expect("reason")\` only in tests or with guaranteed values
- **ALWAYS** handle \`Result\` and \`Option\` explicitly — no silent discards

### Error Design
- **ALWAYS** define custom error enums with \`thiserror\` for libraries
- **ALWAYS** use \`anyhow::Result\` for application-level code
- **ALWAYS** implement \`From<OtherError>\` for error conversion (or use \`#[from]\` with thiserror)
- **NEVER** use \`String\` as an error type — it loses type information

### Idiomatic Patterns
- **ALWAYS** run \`cargo clippy -- -D warnings\` before committing
- **ALWAYS** run \`cargo fmt --check\` before committing
- **NEVER** use excessive \`.clone()\` to satisfy the borrow checker — restructure ownership instead
- **ALWAYS** prefer iterators over manual indexing (\`.iter().map().collect()\`)
- **ALWAYS** use pattern matching exhaustively — never use catch-all \`_\` unless intentional

### Ownership & Lifetimes
- **ALWAYS** prefer borrowing (\`&T\`) over cloning when the function only reads data
- **ALWAYS** use lifetime annotations when the compiler requires them — don't fight the borrow checker
- **ALWAYS** prefer \`impl Trait\` parameters over concrete types for flexibility
- **NEVER** use \`Box<dyn Trait>\` when \`impl Trait\` works (static dispatch is faster)

### Derive & Type Design
- **ALWAYS** derive \`Debug\` on all public types
- **ALWAYS** derive \`Clone\`, \`PartialEq\` where semantically correct
- **ALWAYS** use the builder pattern for types with many optional fields
- **ALWAYS** prefer enums over boolean flags for states (\`State::Active\` vs \`is_active: bool\`)

### Safety
- **NEVER** use \`unsafe\` blocks unless absolutely necessary
- **ALWAYS** add a \`// SAFETY: ...\` comment explaining why \`unsafe\` is sound when used
- **ALWAYS** minimize the scope of \`unsafe\` blocks

### Testing
- **ALWAYS** write \`#[cfg(test)]\` module with unit tests
- **ALWAYS** test error paths, not just the happy path
- **ALWAYS** use \`#[should_panic]\` for expected panics in tests

### Example: Wrong vs Right

\`\`\`rust
// ❌ WRONG — .unwrap() will panic on error
fn read_config() -> Config {
    let content = std::fs::read_to_string("config.toml").unwrap();
    let config: Config = toml::from_str(&content).unwrap();
    config
}

// ✅ RIGHT — proper error propagation with ?
fn read_config() -> Result<Config, Box<dyn std::error::Error>> {
    let content = std::fs::read_to_string("config.toml")?;
    let config: Config = toml::from_str(&content)?;
    Ok(config)
}
\`\`\`

\`\`\`rust
// ❌ WRONG — fighting borrow checker with clone
fn process(data: &Vec<String>) -> Vec<String> {
    data.clone().into_iter().filter(|s| !s.is_empty()).collect()
}

// ✅ RIGHT — borrow and iterate without cloning
fn process(data: &[String]) -> Vec<&str> {
    data.iter().filter(|s| !s.is_empty()).map(|s| s.as_str()).collect()
}
\`\`\`

\`\`\`rust
// ❌ WRONG — String as error type
fn parse_config(path: &str) -> Result<Config, String> {
    let content = std::fs::read_to_string(path)
        .map_err(|e| format!("Failed to read: {e}"))?;
    toml::from_str(&content).map_err(|e| format!("Parse error: {e}"))
}

// ✅ RIGHT — proper error enum with thiserror
#[derive(Debug, thiserror::Error)]
enum ConfigError {
    #[error("Failed to read config: {0}")]
    Io(#[from] std::io::Error),
    #[error("Failed to parse config: {0}")]
    Parse(#[from] toml::de::Error),
}

fn parse_config(path: &str) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    Ok(toml::from_str(&content)?)
}
\`\`\`
`;
