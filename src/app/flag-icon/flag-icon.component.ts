import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flag-icon',
  templateUrl: './flag-icon.component.html',
  styleUrls: ['./flag-icon.component.scss']
})
export class FlagIconComponent implements OnInit {
  @Input() country: string;
  @Input() squared: boolean = false;

  public get countryFlagClass(): object {
    return {
      'flag-icon': true,
      [`flag-icon-${this.country}`]: true
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
