new Deno.Command("deno", {
    args: ["compile", "-A", "--target", "x86_64-pc-windows-msvc", "-o", "dist/server.exe", "src/server/server.ts"],
    stderr: "inherit",
    stdout: "inherit",
}).outputSync();

new Deno.Command("deno", {
    args: ["compile", "-A", "--target", "x86_64-pc-windows-msvc", "-o", "dist/client.exe", "src/client/client.ts"],
    stderr: "inherit",
    stdout: "inherit",
}).outputSync();

new Deno.Command("deno", {
    args: ["compile", "-A", "--target", "x86_64-unknown-linux-gnu", "-o", "dist/server", "src/server/server.ts"],
    stderr: "inherit",
    stdout: "inherit",
}).outputSync();

new Deno.Command("deno", {
    args: ["compile", "-A", "--target", "x86_64-unknown-linux-gnu", "-o", "dist/client", "src/client/client.ts"],
    stderr: "inherit",
    stdout: "inherit",
}).outputSync();