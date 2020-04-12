import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { MonitorComponent } from './monitor/monitor.component';
import { AddServerComponent } from './add-server/add-server.component';
import { OptionsComponent } from './options/options.component';


const routes: Routes = [
  {
    path: 'servers',
    component: ListComponent
  },
  {
    path: 'add-server',
    component: AddServerComponent
  },
  {
    path: 'monitor',
    component: MonitorComponent
  },
  {
    path: '**',
    redirectTo: 'servers'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
