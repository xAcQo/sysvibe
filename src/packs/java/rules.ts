export const javaRules = `
## Java Rules (SysVibe)

### Language Features
- **ALWAYS** use modern Java features (records for DTOs, \`var\` for local variables when type is obvious, switch expressions).
- **NEVER** use raw types (e.g., \`List\` instead of \`List<String>\`).
- **ALWAYS** use \`sealed\` classes when the domain model has a fixed set of implementations.

### Null Safety
- **ALWAYS** use \`java.util.Optional\` as a return type for methods that might not return a value.
- **NEVER** pass \`null\` as a parameter or return \`null\` from a method returning an \`Optional\`.
- **ALWAYS** use \`@NonNull\` and \`@Nullable\` annotations to document nullability contracts at boundaries.

### Resource Management
- **ALWAYS** use try-with-resources for classes implementing \`AutoCloseable\` (Streams, DB connections) to ensure deterministic cleanup.
- **NEVER** rely on finalizers (\`finalize()\`) for resource cleanup.

### Error Handling
- **ALWAYS** throw specific, custom exceptions rather than generic \`Exception\` or \`RuntimeException\`.
- **NEVER** catch \`Throwable\` or \`Error\` (except at the absolute highest level, like a main loop).
- **NEVER** ignore exceptions (empty catch blocks). At minimum, log the exception.

### Example: Wrong vs Right

\`\`\`java
// ❌ WRONG — Manual resource handling, null returns, no generics
public User findUser(int id) {
    Connection conn = null;
    try {
        conn = db.getConnection();
        // ...
        return null; // Bad!
    } catch (Exception e) {
        // Ignored
    } finally {
        if (conn != null) { try { conn.close(); } catch(Exception ex) {} }
    }
    return new User();
}

// ✅ RIGHT — try-with-resources, Optional return, specific exception
public Optional<User> findUser(int id) {
    try (Connection conn = db.getConnection()) {
        // ...
        return Optional.ofNullable(result);
    } catch (SQLException e) {
        log.error("Database error while fetching user {}", id, e);
        throw new DatabaseQueryException("Failed to find user", e);
    }
}
\`\`\`
`;
