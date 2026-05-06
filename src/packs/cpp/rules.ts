export const cppRules = `## C++ Rules (SysVibe)

### Memory Management
- **ALWAYS** use \`std::unique_ptr\` or \`std::shared_ptr\` for heap allocations
- **NEVER** use raw \`new\` / \`delete\` — smart pointers handle cleanup automatically
- **ALWAYS** follow RAII: acquire resources in constructors, release in destructors
- **NEVER** manually manage memory when smart pointers or containers work

### Modern C++ Standards
- **ALWAYS** compile with \`-Wall -Werror -Wpedantic -std=c++17\`
- **ALWAYS** use \`std::string\`, \`std::vector\`, \`std::array\` — never C-style arrays or \`char*\`
- **ALWAYS** use \`auto\` for complex iterator types and lambda return types
- **ALWAYS** use range-based for loops (\`for (const auto& item : container)\`)
- **NEVER** ignore compiler warnings — they indicate real bugs

### Const Correctness & References
- **ALWAYS** pass non-trivial objects by const reference (\`const std::string&\`, not \`std::string\`)
- **ALWAYS** mark member functions that don't modify state as \`const\`
- **ALWAYS** use \`const auto&\` in range-based for loops when not modifying elements
- **NEVER** return non-const references to internal data members

### Move Semantics
- **ALWAYS** implement move constructors for resource-owning classes
- **ALWAYS** use \`std::move\` when transferring ownership
- **NEVER** use a moved-from object — it is in an unspecified state
- **ALWAYS** prefer \`emplace_back\` over \`push_back\` for constructing in-place

### Modern Utilities
- **ALWAYS** use \`std::optional\` for values that may or may not exist (not nullptr/sentinel values)
- **ALWAYS** use structured bindings (\`auto [key, value] = ...\`) for tuple/pair decomposition
- **ALWAYS** use \`std::string_view\` for read-only string parameters
- **ALWAYS** prefer \`constexpr\` over \`#define\` for compile-time constants

### Error Handling
- **ALWAYS** handle error cases explicitly — no silent failures
- **ALWAYS** use exceptions or \`std::optional\`/\`std::expected\` for recoverable errors
- **NEVER** use error codes without checking them

### Concurrency
- **ALWAYS** use \`std::mutex\` with \`std::lock_guard\` or \`std::scoped_lock\`
- **NEVER** manually lock/unlock mutexes (use RAII wrappers)

### Example: Wrong vs Right

\`\`\`cpp
// ❌ WRONG — raw pointer, manual memory management
Widget* createWidget() {
    Widget* w = new Widget();
    w->init();
    return w;  // Who deletes this? Memory leak risk!
}

// ✅ RIGHT — smart pointer, automatic cleanup
std::unique_ptr<Widget> createWidget() {
    auto w = std::make_unique<Widget>();
    w->init();
    return w;  // Ownership is clear, cleanup is automatic
}
\`\`\`

\`\`\`cpp
// ❌ WRONG — C-style array, manual size tracking
void process(int* data, int size) {
    for (int i = 0; i < size; i++) { /* ... */ }
}

// ✅ RIGHT — std::vector with range-based loop
void process(const std::vector<int>& data) {
    for (const auto& item : data) { /* ... */ }
}
\`\`\`

\`\`\`cpp
// ❌ WRONG — returning raw pointer, unclear ownership
Database* getConnection() { return new Database(config); }

// ✅ RIGHT — optional for nullable, unique_ptr for ownership
std::optional<std::unique_ptr<Database>> getConnection(const Config& config) {
    if (!config.valid()) return std::nullopt;
    return std::make_unique<Database>(config);
}
\`\`\`
`;
