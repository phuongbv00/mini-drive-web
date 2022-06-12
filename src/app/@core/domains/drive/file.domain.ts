import {ResourceStatusEnum} from "../../enums/resource-status.enum";
import {UserDomain} from "../user/user.domain";

export interface FileDomain {
  id: string;
  name: string;
  alias: string;
  size: number;
  mime?: string;
  status: ResourceStatusEnum;
  owner: UserDomain;
  createdAt: Date;
  trashedAt: Date;
  downloadTurns: number;
}
