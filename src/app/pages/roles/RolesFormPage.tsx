import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { ButtonLoading, Input, PermissionLayout, TitlePage } from "../../components";
import { FC, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Const } from "../../common";
import { useStores } from "../../models/store";
import { IPermission, IResponse, IRole, ReqRole } from "../../interfaces";
import { useGenPermissionGroup } from "../../hooks";
import { toast } from "react-toastify";

const RolesFormPage = observer(() => {
  const { roleModel } = useStores();
  const [name, setName] = useState('');
  const [permissionsSelect, setPermissionsSelect] = useState<IPermission[]>([])
  const id = useParams().id;
  const { isLoading: isLoadingDetail, refetch } = useQuery({
    queryKey: [Const.QueryKey.roles, id],
    queryFn: () => roleModel.getRole(Number(id)),
    enabled: !!id,
    onSuccess(data) {
      setName(data.name)
      setPermissionsSelect(data.permissions);
    },
  })
  const { permissionsGroup } = useGenPermissionGroup();
  const onSelect = (e: IPermission | IPermission[]) => {
    if (Array.isArray(e)) {
      e.forEach((item) => toggleSelect(item))
    } else {
      toggleSelect(e)
    }
  }
  const toggleSelect = (e: IPermission) => {
    setPermissionsSelect(prev => {
      let newPrev = [...prev]
      if (prev.findIndex(i => i.id === e.id) < 0) {
        newPrev = [...newPrev, e]
      } else {
        newPrev = newPrev.filter(i => i.id !== e.id)
      }
      return newPrev
    })
  }
  const checkIsAll = (permissions: IPermission[]) => {
    return !!(permissions.filter(i => permissionsSelect.map(j => j.name).includes(i.name)).length === permissions.length)
  }
  const { mutate, isLoading } = useMutation<IResponse<IRole>, unknown, ReqRole>({
    mutationFn: (body) => id ? roleModel.putRole(Number(id), body) : roleModel.postRole(body),
    onSuccess(data, variables, context) {
      toast.success('Lưu thành công')
    },
    onError(error, variables, context) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại')
    },
  })
  const handleSave = () => {
    if (name.trim().length === 0) return;
    mutate({ name, permission_ids: permissionsSelect.map(i => i.id) });
  }
  return (
    <PermissionLayout permissions={id ? ['.roles.:id.get', '.roles.:id.patch'] : ['.roles.post']} showEmpty>
      <TitlePage title={id ? 'Cấp quyền' : 'Tạo mới'} />
      <div className="card p-6">
        <div className="flex-row-sp input-wrap w-100">
          <div className="wrap-item mb-4 w-100">
            <label className="form-label fw-bold">Tên quyền</label>
            <Input
              onChange={e => setName(e.target.value)}
              value={name}
              name="priority"
              placeholder="Tên quyền"
            />
          </div>
        </div>
        <div className='post d-flex flex-column-fluid' id="kt_post">
          <div className="w-100">
            {
              permissionsGroup.map(parent => (
                <div key={parent.name} className="mb-8">
                  <span className="fw-bold">{parent.desc}</span>
                  <div className="w-100 d-flex mt-2">
                    <div style={{ width: '14.2%', cursor: 'pointer' }} onClick={() => {
                      if (checkIsAll(parent.permissions)) {
                        onSelect(parent.permissions)
                      } else {
                        onSelect(parent.permissions.filter(i => !permissionsSelect.map(j => j.name).includes(i.name)))
                      }
                    }}>
                      <div>
                        <input type="checkbox" className="form-check-input cursor-pointer" readOnly checked={checkIsAll(parent.permissions)} />
                        <span className="m-2">Tất cả</span>
                      </div>
                    </div>
                    {
                      sortPermissions(parent.permissions).map((permission, index) => (
                        <div key={index} style={{ width: '14.2%', cursor: 'pointer' }}
                          onClick={() => onSelect(permission)}
                        >
                          <div>
                            <input type="checkbox" className="form-check-input cursor-pointer" readOnly checked={!!(permissionsSelect.find(i => i.id === permission.id))} />
                            <span className="m-2">
                              <Method name={permission.name} />
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="d-flex justify-content-end">
          {
            id &&
            <ButtonLoading
              title="Khôi phục"
              className="btn-secondary me-2"
              onClick={() => refetch()}
              loading={isLoadingDetail}
            />
          }
          <ButtonLoading
            title="Lưu"
            className="btn-success"
            onClick={handleSave}
            loading={isLoading}
          />
        </div>
      </div>
    </PermissionLayout>
  )
})

export default RolesFormPage;

const sortPermissions = (permissions: IPermission[]): IPermission[] => {
  return permissions.sort((a, b) => a.name.length - b.name.length)
}

const Method: FC<{ name: string }> = ({ name }) => {
  const renderName = () => {
    let tName = '';
    if (name.includes('get')) tName = 'Danh sách';
    if (name.includes(':id.get')) tName = 'Chi tiết';
    if (name.includes('post') || name.includes('sendNotification')) tName = 'Tạo mới';
    if (name.includes(':id.patch') || name.includes('update')) tName = 'Cập nhật';
    if (name.includes(':id.delete')) tName = 'Xóa';
    return tName
  }
  return (
    <span>
      {renderName()}
    </span>
  )
}