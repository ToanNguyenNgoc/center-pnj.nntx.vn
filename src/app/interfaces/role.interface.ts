export interface IRole {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  active: boolean;
  name: string;
  guard_name: string;
  permissions: IPermission[];
}
export interface IPermission {
  id: number;
  name: string;
  guard_name: string;
  createdAt: string;
  updatedAt: string;
}