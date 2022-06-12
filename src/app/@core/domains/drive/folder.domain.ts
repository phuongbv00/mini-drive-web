import {UserDomain} from "../user/user.domain";
import {ResourceStatusEnum} from "../../enums/resource-status.enum";

export interface FolderDomain {
  id: number;
  name: string;
  status: ResourceStatusEnum;
  createdAt: Date;
  trashedAt: Date;
  owner: UserDomain;
}
