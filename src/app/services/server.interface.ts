export interface Server {
    name: string;
    ip: string;
    port: string;
    flag: string;
    platform: string;
    type: string;
    state?: ServerState
    options?: ServerOptions;
}

export interface ServerState {
    online: number;
    idle: number;
    version: string;
}
export interface PromiseError {
    errno: string;
    code: string;
    syscall: string;
    path: string;
    spawnargs: string[];
}

export interface ServerOptions {
    mtu: number;
    autentication?: {
        user: string;
        pass: string;
    },
    fakeInternet?: boolean;
}