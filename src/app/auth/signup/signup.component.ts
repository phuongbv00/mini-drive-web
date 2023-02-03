import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
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
      fullName: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      cnfPassword: [null, [Validators.required]],
      policy: [true]
    });
  }

  submit(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.value.password !== this.form.value.cnfPassword) {
      this.message.error('Mật khẩu xác nhận không trùng khớp');
      return;
    }
    if (!this.form.value.policy) {
      this.message.warning('Vui lòng đồng ý với các điều khoản');
      return;
    }
    if (this.form.valid) {
      this.isLogging = true;
      this.auth.register(this.form.value)
        .subscribe(
          res => {
            this.router.navigate(['/page'])
              .then(() => this.message.success(res.message))
          },
          err => {
            this.message.error(err.error.message || 'Lỗi đăng ký, vui lòng thử lại');
            this.isLogging = false;
          },
        );
    }
  }
}
