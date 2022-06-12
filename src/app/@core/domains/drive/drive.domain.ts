import {FolderDomain} from "./folder.domain";
import {FileDomain} from "./file.domain";

export interface DriveDomain {
  folders: FolderDomain[];
  files: FileDomain[];
}
