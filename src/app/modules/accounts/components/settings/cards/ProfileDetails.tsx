import * as Yup from 'yup'
import { useFormik } from 'formik'
import { observer } from 'mobx-react-lite'
import { useAuth, usePostMedia } from '../../../../../hooks'
import { Avatar, ButtonLoading, ButtonUpload } from '../../../../../components'
import { ReqPutProfile } from '../../../../../interfaces'

const profileDetailsSchema = Yup.object().shape({
  fullname: Yup.string().required('Fullname is required'),
  email: Yup.string().required('Email is required').email('Email is invalidate'),
  telephone: Yup.string().required('Telephone is required').nullable(true)
})

const ProfileDetails = observer(() => {
  const { profile, setProfile, mutationPutProfile } = useAuth();
  const { handlePostMedia } = usePostMedia();
  const handleUpdateAvatar = (files: FileList) => {
    if (profile) {
      handlePostMedia({
        files,
        callBackLocal: (medias) => {
          setProfile(Object.assign(profile, {
            media: {
              ...profile.media,
              original_url: medias[0].origin_url
            }
          }))
        },
        callBackApi: (medias) => {
          mutationPutProfile.mutate({ media_id: medias[0].id })
        }
      })
    }
  }

  const formik = useFormik<ReqPutProfile>({
    initialValues: {
      fullname: profile?.fullname,
      email: profile?.email,
      telephone: profile?.telephone
    },
    validationSchema: profileDetailsSchema,
    onSubmit: ({ fullname, email, telephone }) => {
      mutationPutProfile.mutate({
        fullname,
        email: profile?.email !== email ? email : undefined,
        telephone: profile?.telephone !== telephone ? telephone : undefined
      });
    },
  })

  return (
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
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Avatar</label>
              <div className='col-lg-8'>
                <Avatar imageUrl={profile?.media?.original_url} size={130} />
                <ButtonUpload onChangeFile={handleUpdateAvatar} />
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Full Name</label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-12 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Full name'
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
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Company</label>

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
                <span className='required'>Contact Phone</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='tel'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Phone number'
                  {...formik.getFieldProps('telephone')}
                />
                {formik.touched.telephone && formik.errors.telephone && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.telephone}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <ButtonLoading
              title='Save changes'
              type='submit'
              loading={mutationPutProfile.isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  )
})

export { ProfileDetails }
