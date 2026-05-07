cmake_minimum_required(VERSION 3.10)
project({{PROJECT_NAME}} C)

set(CMAKE_C_STANDARD 17)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_executable({{PROJECT_NAME}} src/main.c)

target_compile_options({{PROJECT_NAME}} PRIVATE -Wall -Wextra -Werror -Wpedantic)
