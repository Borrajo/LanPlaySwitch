import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Server } from '../services/server.interface';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-delete-zone',
  templateUrl: './delete-zone.component.html',
  styleUrls: ['./delete-zone.component.scss']
})
export class DeleteZoneComponent implements OnInit {
  public get isEnterItem(): boolean {
    return this.common.isDragged;
  }

  constructor(private common: CommonService) { }

  ngOnInit(): void {
  }
  drop(event: CdkDragDrop<Server[]>) {
  }
  entered(event: CdkDragDrop<Server[]>) {
  }
}
