import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {
  public get log(): string {
    return this.logService.log;
  }
  constructor(private logService: LogService) { }

  ngOnInit(): void {
    document.getElementById('monitor').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  public clear(){
    this.logService.clear();
  }
}