import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private _log: '';

  public get log(): string {
    return this._log;
  }

  public clear() {
    this._log = '';
  }

  constructor(private _electron: ElectronService) {
    this._electron.ipcRenderer.on('log', (event, arg) => {
      if (arg !== undefined) {
        this._log += `${arg}\n`;
      }
    })
  }
}
