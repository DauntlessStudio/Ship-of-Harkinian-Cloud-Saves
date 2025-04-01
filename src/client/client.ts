import * as path from "@std/path";
import { SaveData } from "../shared/types.ts";

interface ClientOptions {
    url: string;
    port: string;
    password: string;
    path_to_soh: string;
}

class CloudSaveClient {
    private options: ClientOptions;
    private passHash: Uint8Array = new Uint8Array(0);

    constructor(options?: ClientOptions) {
        this.options = options ?? {
            url: "http://localhost",
            port: "8080",
            password: "",
            path_to_soh: "./"
        };
    }

    public async start(): Promise<void> {
        this.passHash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(this.options.password)));
        const data = await this.GETSaveData();

        if (data) {
            this.writeSaveData(data);
        }

        try {
            console.log("Starting SoH...");
            const process = new Deno.Command(this.getSohPath(), {
                cwd: this.options.path_to_soh,
            });

            const result = await process.output();
            console.log(`Wrapped process exited with code ${result.code}`);

            await this.POSTSaveData(this.readSaveData());
            Deno.exit(0);
        } catch (_error) {
            console.error(`Failed to launch executable at ${this.getSohPath()}`);
            alert("Error starting SoH. Is your `path_to_soh` correct in cloud_save_options.json?");
            Deno.exit(1);
        }
    }

    private async GETSaveData(): Promise<SaveData|undefined> {
        console.log("Downloading save data...");

        try {
            const response = await fetch(`${this.options.url}:${this.options.port}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.passHash}`,
                },
            });
    
            if (response.ok) {
                const data = (await response.json()).data;
                console.log(`Succesfully downloaded ${Object.keys(data).length} saves.`);
                return data;
            } else {
                console.error("Failed to fetch save data:", response.statusText);
                return undefined;
            }
        } catch (error) {
            console.error("Error fetching save data:", error);
        }
    }

    private async POSTSaveData(data: SaveData): Promise<void> {
        console.log(`Uploading ${Object.keys(data).length} saves...`);

        try {
            const response = await fetch(`${this.options.url}:${this.options.port}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.passHash}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Save data uploaded successfully.");
            } else {
                alert("Failed to upload save data: " + response.statusText);
            }
        } catch (error) {
            alert("Error posting save data: " + error);
        }
    }

    private getSohPath(): string {
        const platform = Deno.build.os;
        let sohPath = this.options.path_to_soh;

        if (platform === "windows") {
            sohPath = path.join(sohPath, "soh.exe");
        } else if (platform === "linux") {
            sohPath = path.join(sohPath, "soh.appimage");
        } else if (platform === "darwin") {
            sohPath = path.join(sohPath, "soh.app", "Contents", "MacOS", "SoH");
        }

        return sohPath;
    }

    private readSaveData(): SaveData {
        const data: SaveData = {};
        
        for (const name of ["file1", "file2", "file3"]) {
            try {
                const filepath = path.join(this.options.path_to_soh, "Save", name + ".sav");
                const contents = Deno.readTextFileSync(filepath);
                data[name as keyof SaveData] = contents;
            } catch (_error) {
                // Ignore error if file does not exist
            }
        }

        return data;
    }

    private writeSaveData(data: SaveData): void {
        for (const name of ["file1", "file2", "file3"]) {
            const contents = data[name as keyof SaveData];
            const filepath = path.join(this.options.path_to_soh, "Save", name + ".sav");

            if (contents) {
                Deno.writeTextFileSync(filepath, contents);
            } else {
                try {
                    Deno.removeSync(filepath);
                } catch (_error) {
                    // Ignore error if file does not exist
                }
            }
        }
    }
}

let options: ClientOptions|undefined = undefined;

try {
    options = JSON.parse(Deno.readTextFileSync("./cloud_save_options.json"));
} catch (_error) {
    // Do nothing
}

new CloudSaveClient(options).start();