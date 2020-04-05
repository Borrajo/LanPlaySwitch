import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _isdragged: boolean = true;

  public get isDragged(): boolean {
    return this._isdragged;
  }
  public set isDragged(newValue: boolean) {
    this._isdragged = newValue;
  }
  constructor() { }

}
