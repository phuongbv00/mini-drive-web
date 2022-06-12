import {Component, HostListener, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {DriveDomain} from "../../../@core/domains/drive/drive.domain";
import {DriveUtil} from "../../../@core/utils/drive.util";
import {FileDomain} from "../../../@core/domains/drive/file.domain";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzImage, NzImageService} from "ng-zorro-antd/image";
import {NzModalService} from "ng-zorro-antd/modal";
import {DriveDetailsComponent} from "./drive-details/drive-details.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {FolderDomain} from "../../../@core/domains/drive/folder.domain";
import {DriveService} from "../../../@core/services/drive.service";
import {BehaviorSubject, combineLatest, Subject} from "rxjs";
import {concatMap, debounceTime, startWith, tap} from "rxjs/operators";
import {ResourceStatusEnum} from "../../../@core/enums/resource-status.enum";

@Component({
  selector: 'app-drive-view',
  templateUrl: './drive-view.component.html',
  styleUrls: ['./drive-view.component.scss']
})
export class DriveViewComponent implements OnInit {
  @Input() viewMode: 'grid' | 'table' = 'table';
  @Input() statusMode = ResourceStatusEnum.ACTIVE;

  @ViewChild('fileMenu') fileMenu!: NzDropdownMenuComponent;
  @ViewChild('folderMenu') folderMenu!: NzDropdownMenuComponent;

  data!: DriveDomain;
  selectedFile?: FileDomain;
  selectedFolder?: FolderDomain;
  openedFolder$ = new BehaviorSubject<FolderDomain | null>(null);
  refresh$ = new Subject();
  search$ = new Subject<string>();
  folderStack: FolderDomain[] = [];
  resourceStatusEnum = ResourceStatusEnum;

  constructor(private contextMenuService: NzContextMenuService,
              private imageService: NzImageService,
              private modalService: NzModalService,
              private viewContainerRef: ViewContainerRef,
              private message: NzMessageService,
              private driveService: DriveService) {
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.openedFolder$.next(this.folderStack[this.folderStack.length - 2] ?? null);
  }

  ngOnInit(): void {
    combineLatest([
      this.refresh$.pipe(startWith(true)),
      this.openedFolder$
        .pipe(
          tap(f => this.handleBreadcrumbWhenOpenFolder(f)),
          tap(f => window.history.pushState(f, '', window.location.pathname))
        )
    ])
      .pipe(
        debounceTime(0),
        concatMap(changes => this.driveService.getDrive(this.statusMode, changes[1]?.id)),
      )
      .subscribe(res => this.data = res.data);

    this.search$.subscribe(s => {
      if (s) {
        s = s.toLowerCase();
        this.data = {
          folders: this.data.folders.filter(f => f.name.toLowerCase().includes(s)),
          files: this.data.files.filter(f => f.name.toLowerCase().includes(s)),
        }
      } else {
        this.refresh();
      }
    })
  }

  refresh(b = true): void {
    if (b) {
      this.refresh$.next();
    }
  }

  getExtByFilename = DriveUtil.getExtByFilename;

  getIconByFilename = DriveUtil.getIconByFilename;

  humanFileSize = DriveUtil.humanFileSize;

  openFileContextMenu($event: MouseEvent, file: FileDomain) {
    this.selectedFile = file;
    this.contextMenuService.create($event, this.fileMenu);
  }

  previewFile(file = this.selectedFile) {
    if (file) {
      const src = DriveUtil.getFileUrlById(file?.id);
      if (file.mime?.includes('image')) {
        const previewFile: NzImage = {src}
        this.imageService.preview([previewFile]);
      } else if (file.mime?.includes('pdf') || file.mime?.includes('mp4')) {
        window.open(src, '_blank');
      } else {
        this.message.warning('Không có bản xem trước');
      }
    }
  }

  downloadFile(file = this.selectedFile) {
    if (file) {
      const url = DriveUtil.getFileUrlById(file.id, false);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = file.name;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  }

  viewDetails(file = this.selectedFile) {
    if (file) {
      this.modalService.create({
        nzTitle: file.name,
        nzContent: DriveDetailsComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzComponentParams: {
          file: file,
        },
        nzFooter: null,
      });
    }
  }

  handleBreadcrumbWhenOpenFolder(folder: FolderDomain | null) {
    if (folder) {
      while (this.folderStack.includes(folder)) {
        this.folderStack.pop();
      }
      this.folderStack.push(folder);
    } else {
      this.folderStack = [];
    }
  }

  copyLink(file = this.selectedFile) {
    if (file) {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.opacity = '0';
      selBox.value = DriveUtil.getFileUrlById(file.id);
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.message.success('Sao chép đường dẫn thành công');
    } else {
      this.message.error('Sao chép đường dẫn thất bại');
    }
  }

  openFolderContextMenu($event: MouseEvent, folder: FolderDomain) {
    this.selectedFolder = folder;
    this.contextMenuService.create($event, this.folderMenu);
  }

  viewFolderDetails(folder = this.selectedFolder) {
    if (folder) {
      this.modalService.create({
        nzTitle: folder.name,
        nzContent: DriveDetailsComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzComponentParams: {
          folder: folder,
        },
        nzFooter: null,
      });
    }
  }

  deleteFile(soft = true, file = this.selectedFile) {
    if (file) {
      this.driveService.deleteFile(file.id, soft)
        .subscribe(res => {
            this.message.success(res.message);
            this.refresh();
          },
          err => this.message.error(err.error.message));
    }
  }

  deleteFolder(soft = true, folder = this.selectedFolder) {
    if (folder) {
      this.driveService.deleteFolder(folder.id, soft)
        .subscribe(res => {
            this.message.success(res.message);
            this.refresh();
          },
          err => this.message.error(err.error.message));
    }
  }
}
