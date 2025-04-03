import { useQuery } from "react-query";
import { useStores } from "../models/store"
import { useGetRolesAndPermissions } from "./useGetRolesAndPermissions"
import { Const } from "../common";

export function useGenPermissionGroup() {
  const { roleModel } = useStores();
  const { hasEnabled } = useGetRolesAndPermissions();
  const { data } = useQuery({
    queryKey: [Const.QueryKey.permissions],
    queryFn: () => roleModel.getPermissions(),
    enabled: hasEnabled('permissions.get'),
    staleTime: Const.QueryKey.staleTime
  })
  const permissions = (data?.data || []).filter(i => !i.name.includes('auth'));
  const permissionsGroup = [
    {
      name: 'roles',
      desc: 'Phân quyền',
      permissions: permissions.filter(i => i.name.includes('.roles.'))
    },
    {
      name: 'permissions',
      desc: 'Permissions',
      permissions: permissions.filter(i => i.name.includes('.permissions.'))
    },
    {
      name: 'users',
      desc: 'Người dùng',
      permissions: permissions.filter(i => i.name.includes('.users.'))
    },
    {
      name: 'organizations',
      desc: 'Thông tin công ty',
      permissions: permissions.filter(i => i.name.includes('.organizations.'))
    },
    {
      name: 'brands',
      desc: 'Thương hiệu',
      permissions: permissions.filter(i => i.name.includes('.brands.'))
    },
    {
      name: 'banners',
      desc: 'Banner',
      permissions: permissions.filter(i => i.name.includes('.banners.'))
    },
    {
      name: 'topics',
      desc: 'Chat',
      permissions: permissions.filter(i => i.name.includes('.topics.'))
    },
  ]
  return {
    permissionsGroup
  }
}