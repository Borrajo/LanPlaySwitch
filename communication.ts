import { IpcMain, IpcMainEvent } from 'electron'
import { join } from 'path';
import { spawnSync, ChildProcess, spawn, execFile } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { lanPlayName } from './file.location'
import { Server } from './src/app/services/server.interface';


class Communication {
    private lanPlay: ChildProcess;
    public constructor(ipc: IpcMain) {
        this.initialize(ipc);
    }

    private initialize(ipc: IpcMain) {
        ipc.on('get-servers', this.getServers);
        ipc.on('set-servers', this.setServers);
        ipc.on('exists-lanPlay', this.lanPlayExists);
        ipc.on('connect', this.connectToServer);
        ipc.on('disconnection', this.disconnectToServer);
    }

    private connectToServer(event: IpcMainEvent, server: Server) {
        event.sender.send('log', `Trying connect to: ${server.ip}`);
        const lanPlayPath = join(__dirname, `dist/assets/executables/${lanPlayName[process.platform][process.arch]}`);
        this.lanPlay = spawn(lanPlayPath,
            ['--relay-server-addr', `${server.ip}:${server.port}`, '--pmtu', `${server.options.mtu}`]
            , {
                shell: false,
                windowsHide: true,
                windowsVerbatimArguments: true,
                stdio: ['ignore', 'pipe', 'pipe']
            });
        this.lanPlay.stdout.setEncoding('utf8');
        this.lanPlay.stderr.setEncoding('utf8');

        this.lanPlay.stderr.on('data', (data) => {
            event.sender.send('log', data);
        });
        this.lanPlay.stdout.on('data', (data) => {
            event.sender.send('log', data);
        });
        this.lanPlay.on('error', (err) => {
            JSON.stringify({ error: err });
        })

    }

    private disconnectToServer(event: IpcMainEvent, args: any) {
        if (args.data === 'finish' && this.lanPlay !== undefined) {
            this.lanPlay.kill();
            this.lanPlay.stdout.on('close', () => {
                event.sender.send('log', 'disconnected');
                event.returnValue = true;
            });
        } else {
            event.returnValue = false;
        }

    }

    private setServers(event: IpcMainEvent, args: any) {
        const pathServers = join(__dirname, '/servers.json');
        try {
            writeFileSync(pathServers, args, 'utf8');
            event.returnValue = true;
        } catch (e) {
            event.returnValue = false;
        }
    };

    private getServers(event: IpcMainEvent, args: any) {
        let servers;
        const pathServers = join(__dirname, '/servers.json');
        try {
            servers = readFileSync(pathServers, 'utf8');
        } catch (e) {
            writeFileSync(pathServers, '[]', 'utf8');
            servers = '[]';
        } finally {
            event.returnValue = servers;
        }
    }

    private lanPlayExists(event: IpcMainEvent, args: any) {
        const lanPlayPath = join(__dirname, `dist/assets/executables/${lanPlayName[process.platform][process.arch]}`);
        console.log(lanPlayPath);
        const lanPlayVersion = spawnSync(lanPlayPath, ['--version']);
        if (lanPlayVersion.error) {
            if ((lanPlayVersion.error as any).code === 'ENOENT') {
                event.returnValue = JSON.stringify(
                    {
                        type: 'error',
                        message: 'El sistema no puede encontrar el archivo especificado'
                    }
                );
            }
        } else {
            console.log(Buffer.from(lanPlayVersion.stdout).toString());
            event.returnValue = JSON.stringify(
                {
                    type: 'success',
                    message: `${Buffer.from(lanPlayVersion.stdout).toString()}`
                }
            );
        }
    }
}

export { Communication };