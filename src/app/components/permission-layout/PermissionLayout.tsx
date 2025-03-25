import { FC, Fragment, memo, ReactNode } from "react";
import { PermissionType } from "./permission";
import { useGetRolesAndPermissions } from "../../hooks";
import { Const } from "../../common";

interface PermissionLayoutProps {
  permissions: Array<PermissionType>
  children?: ReactNode;
  showEmpty?: boolean;
}

const checkPermissionMultiple = (permissionsProps: Array<PermissionType>, permissionsAuth: string[]) => {
  return permissionsProps.filter(i => permissionsAuth.includes(i)).length === permissionsProps.length
}

export const PermissionLayout: FC<PermissionLayoutProps> = memo(({
  permissions,
  children,
  showEmpty = false
}) => {
  const { permissions: permissionsAuth, roles } = useGetRolesAndPermissions()
  if (checkPermissionMultiple(permissions, permissionsAuth) || roles.map(i => i.name).includes(Const.Role.SUPER_ADMIN)) {
    return (
      <Fragment>
        {children}
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        {
          showEmpty ?
            <div className="d-flex justify-content-center">
              <h3>Bạn không có quyền truy cập phần này</h3>
            </div>
            :
            null
        }
      </Fragment>
    )
  }
})