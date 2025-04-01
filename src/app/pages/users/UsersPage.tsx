import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { Avatar, ButtonLoading, ConfirmAction, Input, Pagination, PermissionLayout, Switch, TabletBufferZone, TitlePage } from "../../components";
import { KTSVG } from "../../../_metronic/helpers";
import { useStores } from "../../models/store";
import { useMutation, useQuery } from "react-query";
import { Const } from "../../common";
import { aesEncode, formatDate, Toast } from "../../utils";
import { useDebounce, useQueryParams } from "../../hooks";
import { IUserProfile, QrUser, ReqPostUser } from "../../interfaces";
import { Link, useNavigate } from "react-router-dom";

const UsersPage: FC = observer(() => {
  const navigate = useNavigate();
  const { query, handleQueryString } = useQueryParams<QrUser>();
  const search = useDebounce(query.search || '');;
  const { userModel } = useStores();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [Const.QueryKey.users, { ...query, search }],
    queryFn: () => userModel.getUsers({ ...query, search, sort: '-createdAt' }),
  })
  const mutateDelete = useMutation({
    mutationFn: (id: number) => userModel.deleteUser(id),
    onSuccess() { Toast.success('Xóa thành công'); refetch(); ConfirmAction.close() },
    onError() { Toast.error() }
  })
  const onDelete = (id: number) => {
    ConfirmAction.open({
      callBack: () => mutateDelete.mutate(id)
    })
  }
  return (
    <PermissionLayout permissions={['.users.get']} showEmpty>
      <TitlePage title="Người dùng"
        element={
          <PermissionLayout permissions={['.users.post']}>
            <ButtonLoading title="Tạo mới" onClick={() => navigate('/apps/users-form')} />
          </PermissionLayout>
        }
      />
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <div className="w-25">
            <Input
              placeholder="Tìm kiếm Tên, email, điện thoại..."
              defaultValue={query.search}
              onChange={e => handleQueryString('search', e.target.value)}
            />
          </div>
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
                  <th className='ps-4 min-w-250px rounded-start'>Thông tin</th>
                  <th className='ps-4 min-w-250px rounded-start'>Email</th>
                  <th className='min-w-125px'>Quyền</th>
                  <th className='min-w-125px'>Ngày tạo</th>
                  <th className='min-w-125px'>Cập nhật</th>
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
                  data?.data?.map(user => (
                    <UserItem key={user.id} user={user} onDelete={onDelete} />
                  ))
                }
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}
            <Pagination
              count={data?.total_page}
              page={query.page}
              onChangePage={e => handleQueryString('page', e)}
            />
          </div>
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
    </PermissionLayout>
  )
})

interface UserItemProps {
  user: IUserProfile;
  onDelete?: (id: number) => void;
}

const UserItem: FC<UserItemProps> = ({ user, onDelete = () => null }) => {
  const { userModel, topicModel } = useStores()
  const [active, setActive] = useState(user.active);
  const { mutate } = useMutation({
    mutationFn: (body: ReqPostUser) => userModel.patchUser(user.id, body),
    onSuccess() {
      Toast.success();
    },
    onError() {
      setActive(user.active);
      Toast.error();
    },
  })
  const onChangeStatus = (check: boolean) => {
    setActive(check);
    mutate({ active: check })
  }
  const navigate = useNavigate();
  const onNavigateMessenger = async () => {
    const topic = await topicModel.postTopic({ recipient_id: user.id, group_name: '' })
    if (topic.id) {
      navigate(`/apps/messengers/${aesEncode(String(topic.id))}`)
    }
  }
  return (
    <tr key={user.id}>
      <td>
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-50px me-5'>
            <Avatar imageUrl={user.media?.original_url} size={50} />
          </div>
          <div className='d-flex justify-content-start flex-column'>
            <span className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
              {user.fullname}
            </span>
            <span className='text-muted fw-semobold text-muted d-block fs-7'>
              {user.telephone}
            </span>
          </div>
        </div>
      </td>
      <td>
        <span className='text-dark d-block mb-1 fs-6'>
          {user.email}
        </span>
      </td>
      <td>
        <span className='text-dark fw-bold d-block mb-1 fs-6'>
          {user.roles.length === 0 ? 'Khách' : 'Đội ngũ'}
        </span>
      </td>
      <td>
        <span className='text-dark fw-bold d-block mb-1 fs-6'>
          {formatDate(user.createdAt)}
        </span>
      </td>
      <td>
        <span className='text-dark fw-bold d-block mb-1 fs-6'>
          {formatDate(user.updatedAt)}
        </span>
      </td>
      <td>
        <PermissionLayout permissions={['.users.:id.patch']}>
          <Switch
            checked={active}
            onChange={onChangeStatus}
          />
        </PermissionLayout>
      </td>
      <td className='text-end'>
        <PermissionLayout permissions={['.users.:id.get', '.users.:id.patch']}>
          <Link
            to={`/apps/users-form/${user.id}`}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          >
            <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
          </Link>
        </PermissionLayout>
        <PermissionLayout permissions={['.users.:id.delete']}>
          <button
            onClick={() => onDelete(user.id)}
            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          >
            <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
          </button>
        </PermissionLayout>
        <button
          onClick={onNavigateMessenger}
          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
        >
          <KTSVG path='/media/icons/duotune/communication/com003.svg' className='svg-icon-3' />
        </button>
      </td>
    </tr>
  )
}

export default UsersPage;