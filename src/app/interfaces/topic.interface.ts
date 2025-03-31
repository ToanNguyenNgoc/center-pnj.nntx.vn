import { IUserProfile } from "./auth.interface";
import { QrBase } from "./query.interface";

export interface QrTopic extends QrBase{}

export interface ReqPostTopic{
  recipient_id:number;
  group_name:''
}

export interface ITopic {
  id: 6,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  active: boolean,
  group_name: string,
  type: 'DUOS'|'MULTIPLE',
  msg: string|null,
  users:IUserProfile[]
}