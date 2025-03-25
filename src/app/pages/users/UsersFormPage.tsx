import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Avatar, ButtonLoading, ButtonUpload, PermissionLayout, Switch, TitlePage } from "../../components";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { IMedia, ReqPostUser } from "../../interfaces";
import * as Yup from 'yup';
import Select from 'react-select'
import { useGetDataRoles } from "../roles/RolesPage";
import { useStores } from "../../models/store";
import { useMutation, useQuery } from "react-query";
import { Toast } from "../../utils";
import { omit } from "lodash"
import { Const } from "../../common";
import moment from "moment";
import { usePostMedia } from "../../hooks";

interface ReqPostUserData extends ReqPostUser {
  roles: { value: number, label: string }[],
  media?: IMedia
}

const UsersFormPage: FC = observer(() => {
  const id = useParams().id;
  const { userModel } = useStores();
  const { handlePostMedia } = usePostMedia();
  const mutatePostUser = useMutation({
    mutationFn: (body: ReqPostUser) => id ? userModel.patchUser(Number(id), body) : userModel.postUser(body),
    onSuccess() {
      Toast.success();
    },
    onError(error: any) {
      Toast.error(Array.isArray(error.data.message) ? error.data.message?.join(',') : error.data.message);
    }
  })
  const formik = useFormik<ReqPostUserData>({
    initialValues: {
      fullname: '',
      email: '',
      telephone: '',
      birthday: '',
      gender: true,
      password: undefined,
      role_ids: [],
      media_id: undefined,
      active: true,
      roles: [],
      media: undefined
    },
    validationSchema: Yup.object().shape({
      fullname: Yup.string().required('Vui lòng nhập tên'),
      email: Yup.string().required('Vui lòng nhập Email').email('Email không đúng định dạng'),
      telephone: Yup.string().required('Vui lòng nhập điện thoại').nullable(true),
      password: id ? Yup.string().optional() : Yup.string().required('Vui lòng nhập mật khẩu'),
    }),
    onSubmit: (values) => {
      const body = omit(values, ['roles']);
      mutatePostUser.mutate({
        ...body,
        media_id: values.media?.id,
        email: values.email !== dataProfile?.email ? values.email : undefined,
        telephone: values.telephone !== dataProfile?.telephone ? values.telephone : undefined,
        birthday: moment(values.birthday).isValid() ? values.birthday : undefined,
        role_ids: values.roles.map(i => i.value)
      })
    }
  })
  const { data: dataProfile } = useQuery({
    queryKey: [Const.QueryKey.users, id],
    queryFn: () => userModel.getUser(Number(id)),
    enabled: !!id,
    onSuccess(data) {
      formik.setFieldValue('fullname', data.fullname || '');
      formik.setFieldValue('email', data.email || '');
      formik.setFieldValue('telephone', data.telephone || '');
      formik.setFieldValue('birthday', moment(data.birthday).format('YYYY-MM-DD'));
      formik.setFieldValue('gender', data.gender);
      formik.setFieldValue('active', data.active);
      formik.setFieldValue('roles', data.roles.map(i => ({ value: i.id, label: i.name })));
      formik.setFieldValue('media', data.media)
    },
    onError() { Toast.error() }
  })
  const { roles } = useGetDataRoles();
  const postMedia = (files: FileList) => {
    handlePostMedia({
      files,
      callBackLocal(medias) {
        if (medias[0].origin_url) {
          formik.setFieldValue('media', { ...formik.values.media, original_url: medias[0].origin_url })
        }
      },
      callBackApi(medias) {
        if (medias[0].origin_url) {
          formik.setFieldValue('media', { ...formik.values.media, original_url: medias[0].origin_url, id: medias[0].id })
        }
      },
    })
  }
  return (
    <PermissionLayout permissions={id ? ['.users.:id.get', '.users.:id.patch'] : ['.users.post']} showEmpty>
      <TitlePage title={id ? 'Thay đổi thông tin' : 'Tạo mới'} />
      <div className="card p-6">
        <div className='card mb-5 mb-xl-10'>
          <div
            className='card-header border-0 cursor-pointer'
            role='button'
            data-bs-toggle='collapse'
            data-bs-target='#kt_account_profile_details'
            aria-expanded='true'
            aria-controls='kt_account_profile_details'
          >
            <div className='card-title m-0'>
              <h3 className='fw-bolder m-0'>Thông tin</h3>
            </div>
          </div>

          <div id='kt_account_profile_details' className='collapse show'>
            <form
              onSubmit={formik.handleSubmit}
              noValidate className='form'
            >
              <div className='card-body border-top p-9'>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>Hình</label>
                  <div className='col-lg-8 d-flex align-items-center'>
                    <Avatar imageUrl={formik.values.media?.original_url} size={130} />
                    <ButtonUpload size={40} className="ms-4" onChangeFile={postMedia} />
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>Họ và tên</label>

                  <div className='col-lg-8'>
                    <div className='row'>
                      <div className='col-lg-12 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          placeholder='Họ và tên'
                          {...formik.getFieldProps('fullname')}
                        />
                        {formik.touched.fullname && formik.errors.fullname && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.fullname}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>Email</label>

                  <div className='col-lg-8 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Email'
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.email}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>Điện thoại</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <input
                      type='tel'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Điện thoại'
                      {...formik.getFieldProps('telephone')}
                    />
                    {formik.touched.telephone && formik.errors.telephone && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.telephone}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>Mật khẩu</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <input
                      type='password'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Mật khẩu'
                      {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.password}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span>Ngày sinh</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <input
                      type="date"
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Ngày sinh'
                      {...formik.getFieldProps('birthday')}
                    />
                  </div>
                </div>
                {
                  id &&
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span>Trạng thái</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <Switch checked={formik.values.active} onChange={e => formik.setFieldValue('active', e)} />
                    </div>
                  </div>
                }
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span>Gới tính</span>
                  </label>
                  <div className='col-lg-8 fv-row'>
                    <Switch checked={formik.values.gender} onChange={e => formik.setFieldValue('gender', e)} />
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span>Phân quyền</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <Select
                      value={formik.values.roles}
                      onChange={(e: any) => formik.setFieldValue('roles', e)}
                      options={roles.map(i => ({ value: i.id, label: i.name }))}
                      isMulti
                      closeMenuOnSelect={false}
                    />
                  </div>
                </div>
              </div>

              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <ButtonLoading
                  title='Lưu thông tin'
                  type='submit'
                  loading={mutatePostUser.isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </PermissionLayout>
  )
})

export default UsersFormPage;