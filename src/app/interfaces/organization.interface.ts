import { IMedia } from "./media.interface";
import { IDistrict, IProvince, IWard } from "./province.interface";

export interface IOrganizationContact {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  active: boolean;
  contact_type: "SOCIAL" | "PHONE" | "EMAIL";
  value: string;
  icon: string;
}
export interface IOrganization {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  active: boolean;
  name: string;
  latitude: number | null;
  longitude: number | null;
  short_address: string;
  media?: IMedia | null;
  contacts: IOrganizationContact[];
  province: IProvince;
  district: IDistrict;
  ward: IWard;
}

export interface IOrganizationContactType {
  name: string;
  desc: string;
}

export interface ReqPostOrganization {
  name?: string,
  media_id?: number,
  short_address?: string,
  province_code?: number,
  district_code?: number,
  ward_code?: number,
  contacts: ReqPostOrganizationContact[],
  active?: boolean
}
export interface ReqPostOrganizationContact {
  id?: number
  contact_type?: string,
  value?: string,
  icon?: string
}
