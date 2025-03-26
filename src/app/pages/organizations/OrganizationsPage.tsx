import { observer } from "mobx-react-lite";
import { Avatar, ConfirmAction, PermissionLayout, Switch, TabletBufferZone, TitlePage } from "../../components";
import { Link } from "react-router-dom";
import { useStores } from "../../models/store";
import { useMutation, useQuery } from "react-query";
import { Const } from "../../common";
import { FC, useState } from "react";
import { IOrganization } from "../../interfaces";
import { formatDate, Toast } from "../../utils";
import { KTSVG } from "../../../_metronic/helpers";

const OrganizationsPage = observer(() => {
  const { organizationModel } = useStores();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [Const.QueryKey.organizations],
    queryFn: () => organizationModel.getOrgs()
  })
  const mutateDelete = useMutation({
    mutationFn: (id: number) => organizationModel.deleteOrg(id),
    onSuccess() { Toast.success('Xóa thành công'); refetch(); ConfirmAction.close() },
    onError() { Toast.error() }
  })
  return (
    <div className="card">
      <TitlePage
        title="Thông tin công ty"
        element={
          <PermissionLayout permissions={['.organizations.post']}>
            <Link to={'/apps/organizations-form'} className="btn btn-primary">Tạo mới</Link>
          </PermissionLayout>
        }
      />
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-250px rounded-start'>Thông tin</th>
                <th className='ps-4 min-w-100px rounded-start'>Hình ảnh</th>
                <th className='min-w-100px'>Địa chỉ</th>
                <th className='min-w-175px'>Ngày tạo</th>
                <th className='min-w-175px'>Cập nhật</th>
                <th className='min-w-100px'>Trạng thái</th>
                <th className='min-w-100px text-end rounded-end'></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <TabletBufferZone
                isLoading={isLoading}
                isEmpty={data?.total === 0 && !isLoading}
              />
              {
                data?.data?.map(org => (
                  <OrgItem key={org.id} org={org}
                    onDelete={() => ConfirmAction.open({
                      callBack: () => mutateDelete.mutate(org.id)
                    })}
                  />
                ))
              }
            </tbody>
            {/* end::Table body */}
          </table>
        </div>
        {/* end::Table container */}
      </div>
    </div>
  )
})

const OrgItem: FC<{ org: IOrganization, onDelete?: () => void }> = ({ org, onDelete = () => null }) => {
  const { organizationModel } = useStores();
  const [active, setActive] = useState(org.active);
  const mutateActive = useMutation({
    mutationFn: (status: boolean) => organizationModel.patchOrg(org.id, { active: status, contacts: org.contacts }),
    onSuccess() { Toast.success() },
    onError() { Toast.error(); setActive(org.active) }
  })
  return (
    <tr>
      <td>
        <span className="text-dark fw-bold mb-1 fs-6 ps-4">{org.name}</span>
      </td>
      <td>
        <Avatar imageUrl={org.media?.original_url} size={100} />
      </td>
      <td>
        <span className="text-dark mb-1 fs-6 ps-4">
          {`${org.short_address}, ${org.ward?.name}, ${org.district?.name}, ${org.province?.name}`}
        </span>
      </td>
      <td>
        <span className="text-dark mb-1 fs-6 ps-4">{formatDate(org.createdAt)}</span>
      </td>
      <td>
        <span className="text-dark mb-1 fs-6 ps-4">{formatDate(org.updatedAt)}</span>
      </td>
      <td>
        <PermissionLayout permissions={['.organizations.:id.patch']}>
          <Switch checked={active} onChange={e => {
            setActive(e);
            mutateActive.mutate(e)
          }} />
        </PermissionLayout>
      </td>
      <td className='text-end'>
        <PermissionLayout permissions={['.organizations.:id.patch']}>
          <Link
            to={`/apps/organizations-form/${org.id}`}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          >
            <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
          </Link>
        </PermissionLayout>
        <PermissionLayout permissions={['.organizations.:id.delete']}>
          <button
            onClick={onDelete}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
          >
            <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
          </button>
        </PermissionLayout>
      </td>
    </tr>
  )
}

export default OrganizationsPage;