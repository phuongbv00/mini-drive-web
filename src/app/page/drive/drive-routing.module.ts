import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DriveComponent} from "./drive.component";
import {ResourceStatusEnum} from "../../@core/enums/resource-status.enum";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'me',
  },
  {
    path: 'me',
    component: DriveComponent,
    data: {statusMode: ResourceStatusEnum.ACTIVE},
  },
  {
    path: 'trash',
    component: DriveComponent,
    data: {statusMode: ResourceStatusEnum.TRASHED},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriveRoutingModule { }
