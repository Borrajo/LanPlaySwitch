import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../services/options.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  public get mtu(): number {
    return this.options.mtu;
  }
  public set mtu(newNumber: number) {
    this.options.mtu = newNumber;
  }
  constructor(private options: OptionsService) { }

  ngOnInit(): void {
  }

}
