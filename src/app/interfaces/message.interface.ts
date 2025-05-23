import { IUserProfile } from "./auth.interface";
import { IMedia } from "./media.interface";
import { QrBase } from "./query.interface";
import { ITopic } from "./topic.interface";

export interface QrMessage extends QrBase {
  topic_id: number,
  sort?:string,
}

export interface IMessage {
  id: number,
  createdAt: string,
  updatedAt?: string,
  deletedAt?: null,
  active?: boolean,
  msg: string,
  user: IUserProfile,
  medias: IMedia[],
  topic?:ITopic
}