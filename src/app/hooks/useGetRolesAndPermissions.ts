import { useQuery } from "react-query"
import { useStores } from "../models/store"
import { Const } from "../common"
import { PermissionType } from "../components"

export function useGetRolesAndPermissions() {
  const { authModel } = useStores()
  const { data } = useQuery({
    queryKey: [Const.QueryKey.roles_auth],
    queryFn: () => authModel.getRoles(),
    staleTime: 0
  })
  const roles = data || [];
  let permissions: string[] = [];
  try {
    permissions = roles.flatMap(i => i.permissions).map(i => i.name);
  } catch (error) { }
  const hasEnabled = (permission: PermissionType) => (permissions.includes(permission) || roles.map(i => i.name).includes(Const.Role.SUPER_ADMIN));
  return {
    roles,
    permissions,
    hasEnabled
  }
}