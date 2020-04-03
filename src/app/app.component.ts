import { Component, OnDestroy } from '@angular/core';
import { ExecuteService } from './services/connection.service';
import { ServersService } from './services/servers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public get state(): string {
    if (this.connection.serverConnected !== null) {
      return `Conectado a ${this.connection.serverConnected.ip}`;
    }
    return `No conectado`;
  }
  public get isConnected(): boolean {
    return this.connection.isConnected;
  }

  public disconnect() {
    this.connection.disconnect();
  }

  public refresh() {
    this.serverService.updateStateOfServers();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  constructor(private connection: ExecuteService, private serverService: ServersService) { }


  public sections = [
    {
      label: 'Servidores',
      path: 'servers'
    },
    {
      label: 'Opciones',
      path: 'options'
    },
    {
      label: 'Agregar Server',
      path: 'add-server'
    },
  ]
}
