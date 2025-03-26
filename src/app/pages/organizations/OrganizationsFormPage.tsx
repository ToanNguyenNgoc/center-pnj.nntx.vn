import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Avatar, ButtonLoading, ButtonUpload, Input, PermissionLayout, SelectOptionProvince, Switch, TitlePage } from "../../components";
import { useFormik } from "formik";
import { IMedia, IOrganizationContact, ReqPostOrganization } from "../../interfaces";
import * as Yup from 'yup';
import { useGetOrgContactTypes, usePostMedia } from "../../hooks";
import { useMutation, useQuery } from "react-query";
import { useStores } from "../../models/store";
import { Toast } from "../../utils";
import { omit } from 'lodash'
import { Const } from "../../common";
import { KTSVG } from "../../../_metronic/helpers";
import Select from 'react-select';

interface ReqPost extends ReqPostOrganization {
  media?: IMedia | null
}

const OrganizationsFormPage = observer(() => {
  const id = useParams().id;
  const { types } = useGetOrgContactTypes()
  const { organizationModel } = useStores();
  const { handlePostMedia } = usePostMedia();
  const mutateSaveData = useMutation({
    mutationFn: (body: ReqPostOrganization) => id ? organizationModel.patchOrg(Number(id), body) : organizationModel.postOrg(body),
    onSuccess() { Toast.success() },
    onError() { Toast.error() }
  })
  const formik = useFormik<ReqPost>({
    initialValues: {
      name: '',
      province_code: undefined,
      district_code: undefined,
      ward_code: undefined,
      short_address: '',
      media_id: undefined,
      media: undefined,
      contacts: [],
      active: true,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Vui lòng nhập tên'),
      short_address: Yup.string().required('Vui lòng nhập địa chỉ')
    }),
    onSubmit: (values) => {
      const body = omit(values, ['media']);
      body.contacts = body.contacts.filter(i => i.contact_type && i.value)
      mutateSaveData.mutate({ ...body, media_id: values.media?.id });
    }
  })
  const { refetch, isFetching } = useQuery({
    queryKey: [Const.QueryKey.organizations, id],
    queryFn: () => organizationModel.getOrg(Number(id)),
    enabled: !!id,
    onSuccess(data) {
      formik.setValues({
        ...data,
        province_code: data.province?.code,
        district_code: data.district?.code,
        ward_code: data.ward?.code,
      })
    },
  })
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
  //Handle CRUD Contact
  const contacts = formik.values.contacts as IOrganizationContact[]
  const addRowContact = () => {
    formik.setFieldValue('contacts', [...contacts, {}])
  }
  const editRowContact = (index: number, key: string, value: string) => {
    const newContacts = contacts.map((item, indexContact) => {
      let newItem = item;
      if (index === indexContact) {
        //@ts-ignore
        newItem[key] = value;
      }
      return item
    })
    formik.setFieldValue('contacts', newContacts)
  }
  const deleteRowItem = (index: number) => {
    formik.setFieldValue('contacts', contacts.filter((_i, indexContact) => indexContact !== index));
  }
  const getValueContactType = (name: string) => {
    const type = types.find(i => i.name === name);
    if (!type) return undefined;
    return { value: type.name, label: type.desc }
  }
  return (
    <PermissionLayout permissions={id ? ['.organizations.:id.patch', '.admin.orders.:id.patch'] : ['.organizations.post']}>
      <TitlePage title="Thông tin công ty" />
      <div className="card p-6">
        <form
          onSubmit={formik.handleSubmit}
          noValidate className='form'
        >
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>Hình ảnh</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <Avatar imageUrl={formik.values.media?.original_url} size={200} />
              <ButtonUpload size={40} className="ms-4"
                onChangeFile={postMedia}
              />
            </div>
          </div>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>
              <span className='required'>Tên công ty</span>
            </label>

            <div className='col-lg-8 fv-row'>
              <input
                className='form-control form-control-lg form-control-solid'
                placeholder='Tên công ty'
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.name}</div>
                </div>
              )}
            </div>
          </div>
          <SelectOptionProvince
            required
            province_code={formik.values.province_code} onSelectProvince={code => formik.setFieldValue('province_code', code)}
            district_code={formik.values.district_code} onSelectDistrict={code => formik.setFieldValue('district_code', code)}
            ward_code={formik.values.ward_code} onSelectWard={code => formik.setFieldValue('ward_code', code)}
          />
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>
              <span className='required'>Địa chỉ</span>
            </label>

            <div className='col-lg-8 fv-row'>
              <input
                className='form-control form-control-lg form-control-solid'
                placeholder='Địa chỉ'
                {...formik.getFieldProps('short_address')}
              />
              {formik.touched.short_address && formik.errors.short_address && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.short_address}</div>
                </div>
              )}
            </div>
          </div>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>
              <span>Trạng thái</span>
            </label>
            <div className='col-lg-8 fv-row'>
              <Switch checked={formik.values.active} onChange={e => formik.setFieldValue('active', e)} />
            </div>
          </div>
          <div className="mb-6">
            <label className='col-lg-4 col-form-label fw-bold fs-6'>
              <span>Thông tin liên hệ</span>
            </label>
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th className='ps-4 min-w-125px'>Phân loại liên hệ</th>
                    <th className='ps-4 min-w-250px rounded-start'>Giá trị</th>
                    <th className='ps-4 min-w-250px rounded-start'>Icon</th>
                    <th className='min-w-50 text-end rounded-end'></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    formik.values.contacts.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Select
                              value={getValueContactType(item.contact_type || '')}
                              onChange={(e: any) => editRowContact(index, 'contact_type', e.value)}
                              options={types.map(type => ({ value: type.name, label: type.desc }))}
                            />
                          </td>
                          <td>
                            <Input placeholder="Giá trị" defaultValue={item.value} onChange={e => editRowContact(index, 'value', e.target.value)} />
                          </td>
                          <td>
                            <Input placeholder="Link icon" defaultValue={item.icon} onChange={e => editRowContact(index, 'icon', e.target.value)} />
                          </td>
                          <td>
                            <button
                              type="button"
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                              onClick={() => deleteRowItem(index)}
                            >
                              <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>

                </tbody>
                {/* end::Table body */}
              </table>
              <div className="d-flex justify-content-end">
                <ButtonLoading
                  className="btn-success btn-sm mb-2"
                  title="Thêm mới liên hệ"
                  type="button"
                  onClick={addRowContact}
                />
              </div>
              {/* end::Table */}
            </div>
          </div>
          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            {
              id &&
              <ButtonLoading
                title="Khôi phục"
                className="btn-secondary me-2"
                type="button"
                onClick={() => refetch()}
                loading={isFetching}
              />
            }
            <ButtonLoading
              title='Lưu thông tin'
              type='submit'
              loading={mutateSaveData.isLoading}
            />
          </div>
        </form>
      </div>
    </PermissionLayout>
  )
})

export default OrganizationsFormPage;