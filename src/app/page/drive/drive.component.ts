import {Component, OnInit} from '@angular/core';
import {DriveStat} from "./drive-stat/drive-stat.domain";
import {Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ResourceStatusEnum} from "../../@core/enums/resource-status.enum";

@Component({
  selector: 'app-dashboard',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {
  driveStat$!: Observable<DriveStat[]>;
  driveStatusMode!: ResourceStatusEnum;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.driveStatusMode = data.statusMode;
    })
    this.driveStat$ = of([
      {
        title: 'Tài liệu',
        percent: 25,
        icon: 'book',
      },
      {
        title: 'Media',
        percent: 10,
        icon: 'picture',
      },
      {
        title: 'Khác',
        percent: 35,
        icon: 'question',
      },
      {
        title: 'Đã xóa',
        percent: 30,
        icon: 'delete',
      },
    ]);
  }
}
