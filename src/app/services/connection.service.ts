import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import { Server } from './server.interface';
import { ServersService } from './servers.service';
import { OptionsService } from './options.service';
export interface ProgramExist {
  type: 'error' | 'success';
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class ExecuteService {
  private _isConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _serverConnected$: BehaviorSubject<Server> = new BehaviorSubject(null);

  public get isConnected(): boolean {
    return this._isConnected$.value;
  }

  public get serverConnected(): Server | null {
    return this._serverConnected$.value;
  }

  constructor(
    private _electron: ElectronService,
    private serverService: ServersService,
    private options: OptionsService) { }
  /**
   * connectToServer
   */
  public connectToServer(server: Server): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this._electron.isElectronApp) {

        this._isConnected$.next(true);
        this._electron.ipcRenderer.send('connect', server);

        this._electron.ipcRenderer.on('connection-error', (event, responseStringFromIPC: string) => {
          const parsedString = JSON.parse(responseStringFromIPC);
          if (parsedString.error || parsedString.code) {
            reject(parsedString);
            this._isConnected$.next(false);
          }
          if (parsedString.exit) {
            resolve('exit');
            this._isConnected$.next(false);
          }
        });

        setTimeout(() => {
          this.serverService.updateStateOfServers();
          this._serverConnected$.next(server);
          resolve();
        }, 2000);

        this._electron.ipcRenderer.on('connection-done', (event, responseStringFromIPC: string) => {
          const parsedString = JSON.parse(responseStringFromIPC);
          this._serverConnected$.next(server);
          resolve(parsedString);
        }
        );
      }
    })
  }

  // public waitFor<T>(promise: Promise<T>, ms: number): Promise<T> {

  //   const time = new Promise<T>((resolve, reject) => {
  //     return setTimeout(resolve, ms, { code: 'No fail' });
  //   })

  //   return Promise.race<T>([promise, time]);
  // }

  public disconnect() {
    const isClosed: boolean = this._electron.ipcRenderer.sendSync('disconnection', { data: 'finish' });
    if (isClosed) {
      this._isConnected$.next(false);
      this._serverConnected$.next(null);
      setTimeout(() => {
        this.serverService.updateStateOfServers();
      }, 30000);
    }
  }

  public programExists(): Promise<string> {
    return new Promise<any>((resolve, reject) => {
      if (this._electron.isElectronApp) {

        const response: ProgramExist = JSON.parse(this._electron.ipcRenderer.sendSync('exists-lanPlay'));

        if (response.type === 'error') {
          reject(response.message);
        } else {
          resolve(response.message)
        }
      }
    })
  }
}
