const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn, exec } = require('child_process');
const url = require("url");
const path = require("path");
const fs = require("fs");
let lanPlay;
let win;

const file = {
    aix: {
        x32: '',
        x64: ''
    },
    darwin: {
        x32: '',
        x64: ''
    },
    freebsd: {
        x32: '',
        x64: ''
    },
    linux: {
        x32: 'lan-play-linux',
        x64: 'lan-play-linux'
    },
    openbsd: {
        x32: '',
        x64: ''
    },
    sunos: {
        x32: '',
        x64: ''
    },
    win32: {
        ia32: 'lan-play-win32.exe',
        x32: 'lan-play-win32.exe',
        x64: 'lan-play-win64.exe'
    }
}
function createWindow() {
    // console.log(require.resolve('electron'));
    // Create the browser window.
    win = new BrowserWindow({
        width: 1400,
        height: 600,
        darkTheme: false,
        fullscreenable: false,
        resizable: false,
        autoHideMenuBar: true,
        maximizable: false,

        webPreferences: {
            nodeIntegration: true,
        },
    })

    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, `/public/index.html`))

    // Abre las herramientas de desarrollo (DevTools).
    win.webContents.openDevTools();
    // Event when the window is closed.
    win.on('closed', function () {
        win = null
    })

}


// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es clicado y no hay otras ventanas abiertas.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('get-servers', (event, arg) => {
    let servers;
    const pathServers = path.join(__dirname, '/servers.json');
    try {
        servers = fs.readFileSync(pathServers, 'utf8');
    } catch (e) {
        fs.writeFileSync(pathServers, '[]', 'utf8');
        servers = '[]';
    } finally {
        event.returnValue = servers;
    }
});

ipcMain.on('set-servers', (event, arg) => {
    const pathServers = path.join(__dirname, '/servers.json');
    console.log(arg);
    try {
        fs.writeFileSync(pathServers, arg, 'utf8');
        event.returnValue = true;
    } catch (e) {
        event.returnValue = false;
    }
});

ipcMain.on('connection', (event, arg) => {
    if (arg.data === 'finish' && lanPlay !== undefined) {
        lanPlay.kill();
        event.returnValue = 'disconnected';
    } else {
        run(arg)
            .then((data) => { console.log(data); event.reply('connection-done', data) })
            .catch((err) => { event.reply('connection-error', err) });
    }
});

function run(arg) {
    return new Promise((resolve, reject) => {
        const lanPlayPath = path.join(__dirname, `public/assets/executables/${file[process.platform][process.arch]}`);
        lanPlay = spawn(lanPlayPath,
            ['--relay-server-addr', `${arg.server.ip}:${arg.server.port}`, '--pmtu', arg.options.mtu]
            , { windowsHide: true });

        lanPlay.stdout.setEncoding('utf8');

        lanPlay.stdout.on('data', (data) => {
            win.webContents.send('log', data.toString());
            resolve(JSON.stringify({ data: data }));
        })
        lanPlay.stderr.on('data', (data) => {
            if (data.toString().startsWith('[DEBUG]')) {
                win.webContents.send('log', data.toString());
                resolve(JSON.stringify({ data: data.toString() }))
            } else {
                reject(JSON.stringify({ error: data.toString() }))
            }
        })
        lanPlay.on('close', (code) => {
            reject(JSON.stringify({ code: code }))
        })
        lanPlay.on('error', (err) => {
            reject(JSON.stringify({ error: err }))
        })
        lanPlay.on('exit', () => {
            reject(JSON.stringify({ exit: true }))
        })
    })
}
// function initProgram(event, arg) {
//     const lanPlay = path.join(__dirname, 'dist/executable/lan-play-win64.exe');
//     console.log(lanPlay);
//     let process = spawn(lanPlay, ['--relay-server-addr', arg, '--pmtu', 1000]
//     );
//     process.stdout.setEncoding('utf8');
//     // // process = spawn('ls');
//     process.stdout.on('data', (data) => {
//         win.webContents.send('log', Buffer.from(data).toString());
//         console.log('stdOUT:', Buffer.from(data).toString());
//     });

//     process.stderr.on('data', (data) => {
//         console.log(Buffer.from(data).toString());
//         win.webContents.send('log', Buffer.from(data).toString());
//     });

//     process.on('close', (code) => {
//         console.log(`child process exited with code ${ code } `);
//     });
// }


// EXAMPLES
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'pong'
})