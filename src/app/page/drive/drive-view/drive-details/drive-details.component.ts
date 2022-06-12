import {Component, Input, OnInit} from '@angular/core';
import {FileDomain} from "../../../../@core/domains/drive/file.domain";
import {DriveUtil} from "../../../../@core/utils/drive.util";
import {FolderDomain} from "../../../../@core/domains/drive/folder.domain";

@Component({
  selector: 'app-details-view',
  templateUrl: './drive-details.component.html',
  styleUrls: ['./drive-details.component.scss']
})
export class DriveDetailsComponent implements OnInit {
  @Input() file?: FileDomain;
  @Input() folder?: FolderDomain;

  constructor() { }

  ngOnInit(): void {
  }

  humanFileSize = DriveUtil.humanFileSize;

  getExtByFilename = DriveUtil.getExtByFilename;
}
