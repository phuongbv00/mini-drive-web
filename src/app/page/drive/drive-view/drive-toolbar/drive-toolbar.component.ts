import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {NzUploadFile} from "ng-zorro-antd/upload";
import {DriveService} from "../../../../@core/services/drive.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {UntypedFormControl} from "@angular/forms";
import {FolderDomain} from "../../../../@core/domains/drive/folder.domain";
import {debounceTime} from "rxjs/operators";
import {ResourceStatusEnum} from "../../../../@core/enums/resource-status.enum";

@Component({
  selector: 'app-drive-toolbar',
  templateUrl: './drive-toolbar.component.html',
  styleUrls: ['./drive-toolbar.component.scss']
})
export class DriveToolbarComponent implements OnInit {
  @Output() afterUpload = new EventEmitter<boolean>();
  @Output() afterCreateFolder = new EventEmitter<boolean>();
  @Output() onTextSearch = new EventEmitter<string>();

  @Input() openedFolder!: FolderDomain | null;
  @Input() statusMode!: ResourceStatusEnum;

  isFolderCreateModalVisible = false;
  folderCreateFormControl = new UntypedFormControl('Thư mục 1');
  searchFormControl = new UntypedFormControl();
  resourceStatusEnum = ResourceStatusEnum;

  constructor(private drive: DriveService,
              private message: NzMessageService) { }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(text => this.onTextSearch.emit(text));
  }

  beforeUploadFile = (file: NzUploadFile): boolean => {
    this.drive.uploadFile(file, this.openedFolder?.id)
      .subscribe(upload => {
        if (upload.state === 'DONE') {
          this.afterUpload.emit(true);
        }
      });
    return false;
  };

  createFolder() {
    console.log(this.folderCreateFormControl.value)
    this.drive.createFolder({
      name: this.folderCreateFormControl.value,
      parentId: this.openedFolder?.id,
    }).subscribe(res => {
      this.afterCreateFolder.emit(true);
      this.message.success(res.message);
      this.isFolderCreateModalVisible = false;
    }, err => {
      this.message.success(err.error.message);
    });
  }
}
