#include <iostream>
#include <memory>
#include <string>
#include <vector>

int main() {
    // SysVibe: using smart pointers and modern C++ from the start
    auto message = std::make_unique<std::string>("Hello from {{PROJECT_NAME}}!");
    std::cout << *message << std::endl;

    // Example: safe container usage
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}
