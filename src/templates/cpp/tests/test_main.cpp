#include <cassert>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

// Simple test framework — no external dependencies
#define TEST(name) void name(); \
    static struct name##_reg { name##_reg() { name(); std::cout << "  PASS: " #name << std::endl; } } name##_inst; \
    void name()

TEST(test_vector_operations) {
    std::vector<int> v = {1, 2, 3};
    assert(v.size() == 3);
    v.emplace_back(4);
    assert(v.size() == 4);
    assert(v.back() == 4);
}

TEST(test_smart_pointer) {
    auto ptr = std::make_unique<std::string>("hello");
    assert(ptr != nullptr);
    assert(*ptr == "hello");

    // Transfer ownership
    auto ptr2 = std::move(ptr);
    assert(ptr2 != nullptr);
    assert(ptr == nullptr);
}

TEST(test_string_operations) {
    const std::string greeting = "Hello, World!";
    assert(greeting.length() == 13);
    assert(greeting.find("World") != std::string::npos);
}

int main() {
    std::cout << "Running {{PROJECT_NAME}} tests..." << std::endl;
    std::cout << "All tests passed!" << std::endl;
    return 0;
}
