import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { ListComponent } from './list/list.component';
import { FlagIconComponent } from './flag-icon/flag-icon.component';
import { AddServerComponent } from './add-server/add-server.component';
import { NgxElectronModule } from 'ngx-electron';
import { MonitorComponent } from './monitor/monitor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OptionsComponent } from './options/options.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    FlagIconComponent,
    AddServerComponent,
    MonitorComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
