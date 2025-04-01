import type { SaveData } from "../shared/types.ts";
import { promptSecret } from "@std/cli";

interface ServerOptions {
    host?: string;
    port?: string;
    pass?: Uint8Array;
}

class CloudSaveServer {
    private readonly host: string;
    private readonly port: string;
    private readonly pass: Uint8Array;
    private server?: Deno.HttpServer<Deno.NetAddr>;

    constructor(options?: ServerOptions) {
        this.host = options?.host ?? "0.0.0.0";
        this.port = options?.port ?? "8080";
        this.pass = options?.pass ?? new Uint8Array();
    }

    public start(): void {
        this.server = Deno.serve(
            {
                hostname: this.host,
                port: Number(this.port),
                onListen: () => {
                    let ip = this.host;

                    if (this.host === "0.0.0.0") {
                        const networkInterfaces = Deno.networkInterfaces();
                        ip = networkInterfaces.find(
                          (ni) => ni.family === "IPv4" && !ni.address.startsWith("172.")
                        )?.address || "0.0.0.0";
                    }

                    console.log(`Server running on host: http://${ip} with port: ${this.port}`);
                }
            },
            async (req: Request) => {
                switch (req.method) {
                    case "POST": {
                        console.log("POST request received");

                        if (req.headers.get("Content-Type") !== "application/json") {
                            return new Response(JSON.stringify({ message: "Invalid Content-Type" }), { status: 400 });
                        }

                        if (req.headers.get("Authorization") !== `Bearer ${this.pass}`) {
                            console.log("Unauthorized access attempt");
                            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
                        }

                        try {
                            const body = await req.json();
                            this.writeSaveData(body as SaveData);
                            return new Response(JSON.stringify({ message: "Data saved successfully" }), { status: 200 });
                        } catch (_error) {
                            return new Response(JSON.stringify({ message: "Invalid JSON" }), { status: 400 });
                        }
                    }
                    case "GET": {
                        console.log("GET request received");

                        if (req.headers.get("Authorization") !== `Bearer ${this.pass}`) {
                            console.log("Unauthorized access attempt");
                            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
                        }

                        return new Response(JSON.stringify({ message: "Requested Data", data: this.readSaveData() }), { status: 200 });
                    }
                    default: {
                        return new Response(JSON.stringify({ message: "Method not allowed" }), { status: 405 });
                    }
                }
            }
        )
    }

    public stop(): void {
        if (this.server) {
            this.server.shutdown();
            this.server = undefined;
        }
    }

    private readSaveData(): SaveData {
        const data: SaveData = {};

        try {
            Deno.mkdirSync("./saves", { recursive: true });
        } catch (_error) {
            // Ignore error if directory already exists
        }

        for (const name of ["file1", "file2", "file3"]) {
            try {
                const contents = Deno.readTextFileSync("./saves/" + name + ".sav");
                data[name as keyof SaveData] = contents;
            } catch (_error) {
                // Ignore error if file does not exist
            }
        }

        return data;
    }

    private writeSaveData(data: SaveData): void {
        try {
            Deno.mkdirSync("./saves", { recursive: true });
        } catch (_error) {
            // Ignore error if directory already exists
        }

        for (const name of ["file1", "file2", "file3"]) {
            const contents = data[name as keyof SaveData];

            if (contents) {
                Deno.writeTextFileSync("./saves/" + name + ".sav", contents);
            } else {
                try {
                    Deno.removeSync("./saves/" + name + ".sav");
                } catch (_error) {
                    // Ignore error if file does not exist
                }
            }
        }
    }
}

async function getPassword(): Promise<Uint8Array> {
    try {
        return Deno.readFileSync("./pass");
    } catch (_error) {
        const promptResult = promptSecret("Password?") ?? "";
        const password = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(promptResult)));
        Deno.writeFileSync("./pass", password ? password : new Uint8Array());
        return password;
    }
}

const host = prompt("Host IP Address?", "0.0.0.0") ?? undefined;
const port = prompt("Host Port?", "8080") ?? undefined;
const pass = await getPassword();

new CloudSaveServer({host, port, pass}).start();