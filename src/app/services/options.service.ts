import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private _fakeInternet: boolean = false;
  private _MTU: number = 1000;
  private min = 200;
  private max = 1600;
  constructor() { }

  public get mtu(): number {
    return this._MTU;
  }
  public set mtu(newMTU: number) {
    this._MTU = newMTU < this.min ? this.min : newMTU > this.max ? this.max : newMTU;
  }

}
