const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, SysVibe Zig Project!\n", .{});
}

test "basic test" {
    try std.testing.expectEqual(10, 3 + 7);
}
