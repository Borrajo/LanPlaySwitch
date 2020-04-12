import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private _log: BehaviorSubject<string> = new BehaviorSubject('');

  public log(): Observable<string> {
    return this._log.asObservable();
  }

  public clear() {
    this._log.next('');
  }

  constructor(private _electron: ElectronService) {
    this._electron.ipcRenderer.on('log', (event, arg) => {
      if (arg !== undefined) {
        const newLog = `${this._log.value}\n${arg}`;
        this._log.next(newLog);
      }
    })
  }
}
