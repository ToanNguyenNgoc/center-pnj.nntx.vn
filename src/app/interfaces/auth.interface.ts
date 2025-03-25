import { IMedia } from "./media.interface";
import { IRole } from "./role.interface";

export interface IUserLogin {
  id: number;
  fullname: string;
  email: string;
  telephone?: string;
  birthday: string | null;
  gender: boolean;
  active: boolean;
  role: boolean;
  token: string;
  refresh_token: string;
  token_expired_at: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
export interface IUserProfile extends IUserLogin {
  media: IMedia;
  roles: IRole[];
}


//
export interface ReqPutProfile {
  fullname?: string,
  email?: string,
  telephone?: string,
  gender?: true,
  media_id?: number
}
export interface ReqChangePassword {
  password: string,
  new_password: string
}

export interface ReqForgotPassword {
  email: string,
  otp?: string,
  password?: string,
  recaptcha: string
}