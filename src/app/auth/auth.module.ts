import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzFormModule} from "ng-zorro-antd/form";
import {AuthComponent} from "./auth.component";


@NgModule({
  declarations: [
    AuthComponent,
    SigninComponent,
    SignupComponent,
  ],
    imports: [
      CommonModule,
      AuthRoutingModule,
      ReactiveFormsModule,
      NzInputModule,
      NzButtonModule,
      ReactiveFormsModule,
      NzCheckboxModule,
      NzIconModule,
      NzFormModule,
    ]
})
export class AuthModule { }
