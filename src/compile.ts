new Deno.Command("deno", {
    args: ["compile", "-A", "--target", "x86_64-pc-windows-msvc", "-o", "dist/x86_64-windows-server.exe", "src/server/server.ts"],
    stderr: "inherit",
    stdout: "inherit",
}).outputSync();

new Deno.Command("deno", {
    args: ["compile", "-A", "--target", "x86_64-pc-windows-msvc", "-o", "dist/x86_64-windows-client.exe", "src/client/client.ts"],
    stderr: "inherit",
    stdout: "inherit",
}).outputSync();

new Deno.Command("deno", {
    args: ["compile", "-A", "--target", "x86_64-unknown-linux-gnu", "-o", "dist/x86_64-linux-server", "src/server/server.ts"],
    stderr: "inherit",
    stdout: "inherit",
}).outputSync();

new Deno.Command("deno", {
    args: ["compile", "-A", "--target", "x86_64-unknown-linux-gnu", "-o", "dist/x86_64-linux-client", "src/client/client.ts"],
    stderr: "inherit",
    stdout: "inherit",
}).outputSync();