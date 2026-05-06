/// Core library for {{PROJECT_NAME}}.
///
/// Add your public API here.

/// Add two numbers together.
///
/// # Examples
///
/// ```
/// let result = {{PROJECT_NAME_SNAKE}}::add(2, 3);
/// assert_eq!(result, 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// Greet a user by name.
///
/// Returns a formatted greeting string.
pub fn greet(name: &str) -> String {
    format!("Hello, {name}! Welcome to {{PROJECT_NAME}}.")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
        assert_eq!(add(-1, 1), 0);
        assert_eq!(add(0, 0), 0);
    }

    #[test]
    fn test_add_negative() {
        assert_eq!(add(-5, -3), -8);
    }

    #[test]
    fn test_greet() {
        let result = greet("World");
        assert!(result.contains("World"));
        assert!(result.starts_with("Hello"));
    }

    #[test]
    fn test_greet_empty_name() {
        let result = greet("");
        assert!(result.contains("Hello"));
    }
}
