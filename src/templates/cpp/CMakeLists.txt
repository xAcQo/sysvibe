cmake_minimum_required(VERSION 3.20)
project({{PROJECT_NAME}} VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Generate compile_commands.json for clang-tidy
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Strict warnings — SysVibe standard
add_compile_options(-Wall -Wextra -Wpedantic -Werror)

# === Main executable ===
add_executable(${PROJECT_NAME} src/main.cpp)
target_include_directories(${PROJECT_NAME} PRIVATE include)

# === Tests ===
enable_testing()
add_executable(${PROJECT_NAME}_tests tests/test_main.cpp)
target_include_directories(${PROJECT_NAME}_tests PRIVATE include)
add_test(NAME ${PROJECT_NAME}_tests COMMAND ${PROJECT_NAME}_tests)

# === Sanitizer support (opt-in via cmake -DENABLE_SANITIZERS=ON) ===
option(ENABLE_SANITIZERS "Enable AddressSanitizer and UBSan" OFF)
if(ENABLE_SANITIZERS)
  add_compile_options(-fsanitize=address,undefined -fno-omit-frame-pointer -g)
  add_link_options(-fsanitize=address,undefined)
endif()
