export const swiftRules = `
## Swift Rules (SysVibe)

### Safety & Optionality
- **ALWAYS** use \`guard\` statements for early returns and to avoid deep nesting (pyramid of doom).
- **NEVER** use force unwrapping (\`!\`) unless crashing is the explicitly desired behavior (e.g., programmer error, missing bundle resources).
- **ALWAYS** prefer \`if let\` or \`guard let\` for safe optional unwrapping.

### Value Semantics
- **ALWAYS** prefer \`struct\` over \`class\` for data models to ensure value semantics and thread safety.
- **NEVER** use a \`class\` unless you explicitly need reference semantics, inheritance, or Objective-C interoperability.

### Concurrency
- **ALWAYS** use modern Swift Concurrency (\`async/await\`, \`Task\`, \`actor\`) instead of completion handlers or Grand Central Dispatch (GCD).
- **ALWAYS** isolate mutable state in an \`actor\` if it needs to be accessed concurrently.

### Error Handling
- **ALWAYS** handle errors gracefully using \`do-catch\` blocks.
- **NEVER** use \`try!\` to force an operation that can fail, unless a crash is intended. Use \`try?\` if the error can be safely ignored and nil is acceptable.

### Example: Wrong vs Right

\`\`\`swift
// ❌ WRONG — Force unwrapping, completion handlers, class for data
class UserLoader {
    var user: User!
    func fetchUser(id: Int, completion: @escaping (User) -> Void) { ... }
}

// ✅ RIGHT — Safe unwrapping, async/await, struct for data
actor UserLoader {
    var user: User?
    
    func fetchUser(id: Int) async throws -> User {
        let fetchedUser = try await api.fetch(id: id)
        self.user = fetchedUser
        return fetchedUser
    }
}
\`\`\`
`;
