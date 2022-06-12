import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Res} from "../domains/res";
import {DriveDomain} from "../domains/drive/drive.domain";
import {environment} from "../../../environments/environment";
import {Upload} from "../domains/upload";
import {map, scan, tap} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd/message";
import {ResourceStatusEnum} from "../enums/resource-status.enum";

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  uploading$ = new Subject<Upload>();

  constructor(private http: HttpClient,
              private message: NzMessageService) {
  }

  getDrive(statusMode = ResourceStatusEnum.ACTIVE, folderId?: number): Observable<Res<DriveDomain>> {
    const uri = folderId
      ? `drive/${folderId}`
      : 'drive';
    return this.http.get<Res<DriveDomain>>(`${environment.apiEndpoint}/${uri}?status=${statusMode}`);
  }

  uploadFile(file: any, folderId?: number): Observable<Upload> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId.toString());
    }
    return this.upload(`${environment.apiEndpoint}/drive/file/upload`, formData, file.name);
  }

  createFolder(body: {name: string, parentId?: number}): Observable<Res<any>> {
    return this.http.post<Res<any>>(`${environment.apiEndpoint}/drive/folder`, body);
  }

  deleteFile(id: string, soft = true): Observable<Res<any>> {
    const params = new HttpParams()
      .append('soft', soft);
    return this.http.delete<Res<any>>(`${environment.apiEndpoint}/drive/file/${id}`, {params});
  }

  deleteFolder(id: number, soft = true): Observable<Res<any>> {
    const params = new HttpParams()
      .append('soft', soft);
    return this.http.delete<Res<any>>(`${environment.apiEndpoint}/drive/folder/${id}`, {params});
  }

  previewFile(id: string): Observable<string> {
    return this.http
      .get(`${environment.apiEndpoint}/drive/file/${id}?preview=true`, {responseType: 'blob'})
      .pipe(map(blob => {
        return URL.createObjectURL(blob);
      }));
  }

  downloadFile(id: string, filename: string): Observable<Blob> {
    return this.http
      .get(`${environment.apiEndpoint}/drive/file/${id}?preview=false`, {responseType: 'blob'})
      .pipe(tap(blob => {
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }));
  }

  private upload(url: string, formData: FormData, title: string): Observable<Upload> {
    const initialState: Upload = {state: 'PENDING', progress: 0, title}
    const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
      if (event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress) {
        upload = {
          progress: event.total
            ? Math.round((100 * event.loaded) / event.total)
            : upload.progress,
          state: 'IN_PROGRESS',
          title,
        }
      }
      if (event.type === HttpEventType.Response) {
        upload = {
          progress: 100,
          state: 'DONE',
          title,
        }
      }
      return upload;
    }
    return this.http.post<HttpEvent<unknown>>(url, formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      scan(calculateState, initialState),
      tap(
        upload => this.uploading$.next(upload),
        () => this.uploading$.next({
          progress: 100,
          state: 'FAILED',
          title,
        })),
      tap(upload => {
        if (upload.state === 'DONE') {
          this.message.success('Tải lên thành công');
        }
      }, err => this.message.error(err.error.message || 'Tải lên tệp thất bại')),
    );
  }
}
