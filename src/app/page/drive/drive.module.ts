import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DriveRoutingModule} from './drive-routing.module';
import {DriveComponent} from './drive.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {DriveStatComponent} from './drive-stat/drive-stat.component';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzInputModule} from "ng-zorro-antd/input";
import {DriveViewComponent} from "./drive-view/drive-view.component";
import {DriveToolbarComponent} from "./drive-view/drive-toolbar/drive-toolbar.component";
import {DriveDetailsComponent} from "./drive-view/drive-details/drive-details.component";


@NgModule({
  declarations: [
    DriveComponent,
    DriveStatComponent,
    DriveViewComponent,
    DriveToolbarComponent,
    DriveDetailsComponent,
  ],
  imports: [
    CommonModule,
    DriveRoutingModule,
    NzIconModule,
    NzProgressModule,
    NzButtonModule,
    NzTableModule,
    NzIconModule,
    NzDropDownModule,
    NzImageModule,
    NzModalModule,
    NzTabsModule,
    NzBreadCrumbModule,
    RouterModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzButtonModule,
    NzInputModule,
  ]
})
export class DriveModule { }
