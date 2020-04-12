import { Component, OnInit, Input } from '@angular/core';
import { OptionsService } from '../services/options.service';
import { ServerOptions } from '../services/server.interface';
import { ServersService } from '../services/servers.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  @Input() options: ServerOptions;
  @Input() disabled: boolean;
  
  public get mtu(): number {
    return this.options.mtu;
  }

  public set mtu(newNumber: number) {
    this.options.mtu = newNumber;
    this.servers.saveListServers();
  }

  constructor(private servers: ServersService) { }
  ngOnInit(): void {
  }

}
