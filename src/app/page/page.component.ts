import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {DriveService} from "../@core/services/drive.service";
import {Upload} from "../@core/domains/upload";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  isCollapsed = false;
  appName = environment.appName;
  authUser: any;
  uploading?: Upload;

  constructor(private auth: AuthService,
              private router: Router,
              private message: NzMessageService,
              private driveService: DriveService) { }

  ngOnInit(): void {
    this.authUser = this.auth.getPayload().credentials;
    this.driveService.uploading$
      .subscribe(upload => {
        this.uploading = upload;
        if (upload.state === 'DONE' || upload.state === 'FAILED') {
          setTimeout(() => this.uploading = undefined, 3000);
        }
      });
  }

  logout() {
    this.auth.logout()
      .subscribe(res => {
          if (res) {
            this.router.navigate(['/auth/signin'])
              .then(() => this.message.success('Đăng xuất thành công'));
          } else {
            this.message.error('Đăng xuất thất bại');
          }
        }
      )
  }

}
