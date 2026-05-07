export const zigRules = `## Zig Rules (SysVibe)

### Allocator Enforcement
- **ALWAYS** explicitly accept a \`std.mem.Allocator\` as a parameter for any function or struct that allocates memory.
- **NEVER** use hidden globals or implicitly initialized allocators.
- **ALWAYS** initialize an arena or general purpose allocator at the highest possible scope (like \`main\`) and pass it down.

### Error Handling
- **ALWAYS** use error unions (e.g. \`!type\`) for functions that can fail.
- **ALWAYS** use \`try\` to propagate errors upward, or \`catch\` to handle them explicitly.
- **NEVER** ignore errors with \`catch unreachable\` unless you have mathematically proven it cannot fail, and add a comment explaining why.

### Resource Management
- **ALWAYS** use \`defer\` or \`errdefer\` immediately after acquiring a resource (memory, files, locks) to ensure cleanup.

### Comptime
- **ALWAYS** use \`comptime\` for metaprogramming, generics, and type-level checks.
- **ALWAYS** favor \`comptime\` checks over runtime checks for things that are known at compile time.

### Example: Wrong vs Right

\`\`\`zig
// ❌ WRONG — hidden allocator, panics on failure
fn loadConfig() *Config {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    var config = allocator.create(Config) catch unreachable;
    return config;
}

// ✅ RIGHT — explicit allocator, propagates errors
fn loadConfig(allocator: std.mem.Allocator) !*Config {
    var config = try allocator.create(Config);
    errdefer allocator.destroy(config);
    // ... initialize config ...
    return config;
}
\`\`\`
`;
