import {Component, Input, OnInit} from '@angular/core';
import {DriveStat} from "./drive-stat.domain";

@Component({
  selector: 'app-drive-stat',
  templateUrl: './drive-stat.component.html',
  styleUrls: ['./drive-stat.component.scss']
})
export class DriveStatComponent implements OnInit {
  @Input() stat?: DriveStat[] | null;

  constructor() { }

  ngOnInit(): void {
  }

}
