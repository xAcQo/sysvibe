export const csharpRules = `
## C# Rules (SysVibe)

### Language Features
- **ALWAYS** use C# 10+ features (file-scoped namespaces, global usings, record types).
- **ALWAYS** enable Nullable Reference Types (\`#nullable enable\` or \`<Nullable>enable</Nullable>\`) and treat warnings as errors.
- **NEVER** use \`!\` (null-forgiving operator) to silence the compiler without a justification comment.

### Resource Management
- **ALWAYS** use \`using\` declarations for \`IDisposable\` objects to ensure deterministic cleanup.
- **NEVER** leave streams, connections, or unmanaged resources undisposed.

### LINQ & Collections
- **ALWAYS** prefer LINQ methods for data transformation over manual loops.
- **ALWAYS** use \`IReadOnlyList<T>\` or \`IEnumerable<T>\` for public return types to enforce immutability where possible.
- **NEVER** use generic \`List<T>\` for public properties if they shouldn't be modified by consumers.

### Asynchronous Programming
- **ALWAYS** use \`async\` and \`await\` for I/O bound operations.
- **NEVER** use \`.Result\` or \`.Wait()\` on Tasks (avoids deadlocks).
- **ALWAYS** pass \`CancellationToken\` through async call chains.

### Example: Wrong vs Right

\`\`\`csharp
// ❌ WRONG — Manual resource handling, synchronous I/O, nullable issues
public string ReadData(string path) {
    var stream = new FileStream(path, FileMode.Open);
    var reader = new StreamReader(stream);
    return reader.ReadToEnd(); // stream is not disposed!
}

// ✅ RIGHT — File-scoped using, async I/O, cancellation tokens
public async Task<string> ReadDataAsync(string path, CancellationToken ct = default) {
    using var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, useAsync: true);
    using var reader = new StreamReader(stream);
    return await reader.ReadToEndAsync(ct);
}
\`\`\`
`;
