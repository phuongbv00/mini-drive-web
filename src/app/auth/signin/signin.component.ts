import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  appName = environment.appName;
  form!: UntypedFormGroup;
  passwordVisible = false;
  isLogging = false;

  constructor(private fb: UntypedFormBuilder,
              private auth: AuthService,
              private message: NzMessageService,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.valid) {
      this.isLogging = true;
      this.auth.login(this.form.value)
        .subscribe(
          res => {
            this.router.navigate(['/page'])
              .then(() => this.message.success(res.message))
          },
          err => {
            this.message.error(err.error.message || 'Lỗi đăng nhập, vui lòng thử lại');
            this.isLogging = false;
          },
        );
    }
  }
}
