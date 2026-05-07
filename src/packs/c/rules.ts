export const cRules = `## C Rules (SysVibe)

### Memory Management
- **ALWAYS** check the return value of \`malloc\`, \`calloc\`, and \`realloc\` for \`NULL\`.
- **ALWAYS** pair every memory allocation with a corresponding \`free\`. Memory leaks are unacceptable.
- **NEVER** use \`gets\`. Always use safer alternatives like \`fgets\`.
- **ALWAYS** use bounds-checked string functions where possible (e.g., \`snprintf\` over \`sprintf\`, \`strncpy\` over \`strcpy\`), and explicitly ensure null-termination.

### Architecture and Encapsulation
- **ALWAYS** use opaque pointers to hide struct implementations in the \`.c\` file, exposing only the typedef in the \`.h\` header.
- **NEVER** expose internal state directly. Provide getter and setter functions.
- **ALWAYS** prefix global functions and types with a namespace-like prefix (e.g., \`module_init\`).

### Error Handling
- **ALWAYS** return an integer or enum error code from functions that can fail.
- **ALWAYS** return output values via pointer parameters when the return type is used for an error code.
- **NEVER** ignore return values from standard library functions (like \`fread\` or \`fwrite\`).

### Modern C Standards
- **ALWAYS** compile with \`-Wall -Wextra -Werror -Wpedantic -std=c17\`.
- **ALWAYS** use fixed-width integer types from \`<stdint.h>\` (e.g., \`uint32_t\`, \`int64_t\`) instead of plain \`int\` or \`long\` for cross-platform consistency.
- **ALWAYS** use \`stdbool.h\` for booleans (\`bool\`, \`true\`, \`false\`).

### Example: Wrong vs Right

\`\`\`c
// ❌ WRONG — no error checking, poor encapsulation, unsafe string functions
struct User {
    char name[50];
};

struct User* create_user(const char* name) {
    struct User* u = malloc(sizeof(struct User));
    strcpy(u->name, name); // Unsafe!
    return u;
}

// ✅ RIGHT — opaque pointers, memory checked, safe strings
// In header (user.h):
typedef struct User User;
int user_create(User** out_user, const char* name);
void user_destroy(User* user);

// In source (user.c):
struct User {
    char name[50];
};

int user_create(User** out_user, const char* name) {
    if (!out_user || !name) return -1;
    
    *out_user = malloc(sizeof(User));
    if (!*out_user) return -2; // Allocation failed
    
    strncpy((*out_user)->name, name, sizeof((*out_user)->name) - 1);
    (*out_user)->name[sizeof((*out_user)->name) - 1] = '\\0'; // Ensure null-termination
    
    return 0; // Success
}
\`\`\`
`;
