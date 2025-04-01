# Cloud Save For Ship of Harkinian
This is a simple, lightweight system to add cloud storage to your Ship of Harkinian OoT saves.

## Setting Up The Server
Go to the Latest Release and download and run the server executable appropriate for your system. You will be prompted for the `Host IP Address` and `Host Port`, if you don't know what those mean, or don't care to change them, just press Enter to accept the defaults. You will also be prompted for a password on the first run, you can leave this empty if you want.

After running, you should see output like `Server running on host: http://192.168.1.x with port: 8080` make a note of this, you'll need it for the client. You should also see a new folder called `saves`. If you currently have any save files that you want to backup, you should copy them from your `Save` folder where you have Ship of Harkinian installed.

Note that this is a minimal server, and is not exposed to the Internet unless you forward the port through your router. If you chose to port forward, it's recommended you use a password to ensure your save files can't be modified by other people. If you are unfamiliar with what this means, your server will only be available on your local Wi-Fi.

## Setting Up The Client
Got to the Latest Release and download the client.zip file appropriate for your system. Extract the folder, and there should be two files within: the executable and a `cloud_save_options.json`. It's recommended to move these to your Ship of Harkinian install folder, but you can put them anywhere. The cloud save file should look like this:

```json
{
    "url": "http://localhost",
    "port": 8080,
    "password": "",
    "path_to_soh": "./"
}
```

Make the following changes before you continue:
- `url`: Set this to host the Server output.
- `port`: Set this to the port the Server output.
- `password`: Set this to whatever you set your password as on the server. Use `""` for no password.
- `path_to_soh`: This is the path to the folder where Ship of Harkinian is installed. If you put this file and the executable in the folder where Ship is installed then you don't need to change this.

If you have any save files you want to keep, make sure you followed the instructions about backing up your saves in the Server section, it's important because when you run the client for the first time **it will erase your saves if you did not back them up to the server**.

## Ready To Go
With everything set up, you should be ready to go. Just run the client executable and your saves from the server will be downloaded and Ship of Harkinian will launch. Once you're finished and quit Ship, your saves will be uploaded to the server.