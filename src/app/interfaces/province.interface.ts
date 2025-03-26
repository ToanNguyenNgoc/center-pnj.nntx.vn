export interface ILocation {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  createdAt: string;
}

export interface IProvince extends ILocation {
  phone_code: number;
}

export interface IDistrict extends ILocation {
  province_code: number;
}

export interface IWard extends ILocation {
  district_code: number;
}