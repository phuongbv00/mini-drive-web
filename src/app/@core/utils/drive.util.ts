import {environment} from "../../../environments/environment";

export class DriveUtil {
  public static getExtByFilename(filename: string): string {
    return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
  }

  public static getIconByFilename(filename: string): string {
    const ext = DriveUtil.getExtByFilename(filename);
    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'picture';
      case 'gif':
        return 'file-gif';
      case 'doc':
      case 'docx':
        return 'file-word';
      case 'xls':
      case 'xlsx':
        return 'file-excel';
      case 'pdf':
        return 'file-pdf';
      case 'ppt':
      case 'pptx':
        return 'file-ppt';
      case 'zip':
      case 'rar':
        return 'file-zip';
      case 'mp3':
      case 'mp4':
        return 'play-circle';
      case 'txt':
        return 'file-text';
      default:
        return 'file-unknown';
    }
  }

  public static humanFileSize(size: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = 0;
    while (size >= 1024) {
      size /= 1024;
      ++i;
    }
    return size.toFixed(1) + ' ' + units[i];
  }

  public static getFileUrlById(id: string, preview = true): string {
    return `${environment.apiEndpoint}/drive/file/${id}?preview=${preview}`;
  }
}
