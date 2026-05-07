export const goRules = `## Go Rules (SysVibe)

### Error Handling
- **ALWAYS** wrap errors with context using \`fmt.Errorf("failed to ...: %w", err)\` so the original error type can be checked with \`errors.Is\` or \`errors.As\`.
- **NEVER** discard errors with \`_\` (e.g. \`_, err := ...\`) unless explicitly documented why it's safe.
- **ALWAYS** return early on errors to avoid deep nesting (the "line of sight" rule).

### Context
- **ALWAYS** pass \`context.Context\` as the first argument to functions that do I/O, make network requests, or could take a long time.
- **NEVER** store \`context.Context\` inside a struct. It should flow through function arguments.

### Interfaces
- **ALWAYS** accept interfaces and return concrete structs where appropriate ("accept interfaces, return structs").
- **NEVER** define interfaces on the producer side unless necessary. Interfaces should be defined where they are used.

### Concurrency
- **ALWAYS** use \`sync.WaitGroup\` to wait for a collection of goroutines to finish.
- **ALWAYS** handle panics in long-running goroutines using \`defer recover()\`.
- **NEVER** use global variables for concurrency without proper synchronization (e.g. \`sync.Mutex\`, \`sync.RWMutex\`, or atomic operations).

### Idiomatic Patterns
- **ALWAYS** use \`defer\` immediately after acquiring a resource (file, lock, connection).
- **ALWAYS** use standard \`gofmt\` or \`goimports\` style formatting.

### Example: Wrong vs Right

\`\`\`go
// ❌ WRONG — no error wrapping, poor context usage
func loadUser(db *sql.DB, id int) (*User, error) {
    var u User
    err := db.QueryRow("SELECT name FROM users WHERE id = $1", id).Scan(&u.Name)
    if err != nil {
        return nil, err // Loses context
    }
    return &u, nil
}

// ✅ RIGHT — context passed, error wrapped
func loadUser(ctx context.Context, db *sql.DB, id int) (*User, error) {
    var u User
    err := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id = $1", id).Scan(&u.Name)
    if err != nil {
        return nil, fmt.Errorf("loading user %d: %w", id, err)
    }
    return &u, nil
}
\`\`\`
`;
