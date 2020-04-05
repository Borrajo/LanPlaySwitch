import { CdkDragDrop, moveItemInArray, CdkDragExit, CdkDragRelease } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExecuteService } from '../services/connection.service';
import { Server } from '../services/server.interface';
import { ServersService } from '../services/servers.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public servers: Server[];
  public get isConnected(): boolean {
    return this.conectService.isConnected;
  }
  public isConnecting: boolean = false;

  constructor(private serverService: ServersService,
    private conectService: ExecuteService,
    private route: Router,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.serverService.servers.subscribe({
      next: (s) => {
        this.servers = s;
        if (this.servers.length === 0) {
          this.route.navigateByUrl('add-server');
        }
      },
      error: (e) => console.log(e)
    })
  }

  public connect(server: Server) {
    this.isConnecting = true;
    this.conectService.connectToServer(server)
      .then((data) => {
        this.isConnecting = false;
      })
      .catch((e) => {
        this.isConnecting = false;
        alert(e.error);
      });
  }
  isServerDown(server: Server): boolean {
    return server.state !== undefined || server.state?.online >= 0;
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.servers, event.previousIndex, event.currentIndex);
    this.common.isDragged = false;
    this.serverService.saveListServers(this.servers);
  }
  dropOut(event: CdkDragDrop<string[]>) {
    if (event.container.id === 'deleteZone') {
      event.previousContainer.data.splice(event.previousIndex, 1);
      this.serverService.saveListServers(this.servers);
    }
    this.common.isDragged = false;
  }
  dragInit(event: CdkDragDrop<string[]>) {
    this.common.isDragged = true;
  }
}
