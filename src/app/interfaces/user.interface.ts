import { QrBase } from "./query.interface";

export interface QrUser extends QrBase { }

export interface ReqPostUser {
  fullname?: string,
  email?: string,
  telephone?: string,
  birthday?: string,
  gender?: boolean,
  password?: string,
  active?: boolean,
  role_ids?: number[],
  media_id?: number
}