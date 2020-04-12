import { Injectable } from '@angular/core';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Server, ServerState } from './server.interface';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class ServersService {
  public get servers(): Observable<Server[]> {
    return this._servers$.asObservable();
  }
  private _servers$: BehaviorSubject<Server[]> = new BehaviorSubject([]);
  public constructor(private http: HttpClient, private _electron: ElectronService) {
    if (this._servers$.value.length === 0) {

      const servers = JSON.parse(this._electron.ipcRenderer.sendSync('get-servers'));
      this._servers$.next(servers);

      this.updateStateOfServers();

    }
  }

  public addServer(newServer: Server) {
    if (!newServer.options) {
      newServer.options = { mtu: 1000 }
    }
    this._servers$.value.push(newServer);
    this.updateStateOfServers();
    this.saveListServers();
  }

  public saveListServers(newServers?: Server[]) {
    const servers = newServers ? newServers : this._servers$.value;
    const response = this._electron.ipcRenderer.sendSync('set-servers', JSON.stringify(servers));
  }

  public updateStateOfServers() {

    this._servers$.value.forEach((s) => {
      this.http.get<ServerState>(`http://${s.ip}:${s.port}/info`)
        .pipe(
          retry(2))
        .subscribe({
          next: (state) => {
            s.state = state;
          },
          error: (error) => {
            s.state = undefined;
          }
        })
    });
  }
}
