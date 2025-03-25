import { observer } from "mobx-react-lite";
import { ButtonLoading, PermissionLayout, TitlePage } from "../../components";
import { useQuery } from "react-query";
import { Const } from "../../common";
import { useStores } from "../../models/store";
import { useGetRolesAndPermissions } from "../../hooks";
import { Link, useNavigate } from "react-router-dom";

export function useGetDataRoles() {
  const { hasEnabled } = useGetRolesAndPermissions()
  const { roleModel } = useStores()
  const { data } = useQuery({
    queryKey: [Const.QueryKey.roles],
    queryFn: () => roleModel.getRoles(),
    enabled: hasEnabled('.roles.get'),
  })
  return {
    data,
    roles: data?.data || []
  }
}

const RolesPage = observer(() => {
  const navigate = useNavigate()
  const {data} = useGetDataRoles()

  return (
    <PermissionLayout permissions={['.roles.get']} showEmpty>
      <TitlePage
        title="Nhóm người dùng"
        element={
          <ButtonLoading
            title="Tạo mới"
            onClick={() => navigate('/apps/roles-form')}
          />
        }
      />
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Nhóm quyền</span>
          </h3>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold text-muted bg-light'>
                  <th className='min-w-100x'>#</th>
                  <th className='ps-4 min-w-300px rounded-start'>Tên quyền</th>
                  <th className='min-w-200px text-end'>Thao tác</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {
                  data?.data?.map((role, index) => (
                    <tr key={role.id}>
                      <td>
                        <span className="text-dark fw-bold mb-1 fs-6">
                          {index + 1}
                        </span>
                      </td>
                      <td>
                        <span className='text-dark fw-bold d-block mb-1 fs-6'>
                          {role.name}
                        </span>
                      </td>
                      <td className='text-end'>
                        <PermissionLayout permissions={['.roles.:id.get', '.roles.:id.patch']}>
                          <Link
                            to={`/apps/roles-form/${role.id}`}
                            className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                          >
                            Cấp quyền
                          </Link>
                        </PermissionLayout>
                        <PermissionLayout permissions={['.roles.:id.delete']}>
                          <button className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4'
                          >
                            Xóa
                          </button>
                        </PermissionLayout>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}
          </div>
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
    </PermissionLayout>
  )
})

export default RolesPage;