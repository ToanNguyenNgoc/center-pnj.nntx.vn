import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useAuth, useRecaptcha } from '../../../hooks'
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { observer } from 'mobx-react-lite'
import { Modal } from 'react-bootstrap'
import { CSSProperties, useState } from 'react'
import OTPInput from 'react-otp-input'
import { ButtonLoading } from '../../../components'

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})

const inputOtpStyle: CSSProperties = {
  width: '48px',
  aspectRatio: '1/1',
  fontSize: 16,
  textAlign: 'center',
  border: 'none',
  outline: 'none',
  backgroundColor: 'var(--kt-input-solid-bg)',
  margin: '0px 6px'
}

export const ForgotPassword = observer(() => {
  const {
    recaptcha_key,
    recaptcha,
    refreshReCaptcha,
    onRefreshRecaptcha,
    verifyRecaptchaCallback
  } = useRecaptcha();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { mutationPostForgotPassword } = useAuth()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      otp: ''
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      mutationPostForgotPassword.mutateAsync({
        email: values.email,
        recaptcha,
      })
        .then(() => {
          setOpenModal(true);
          onRefreshRecaptcha();
        })
        .catch(() => onRefreshRecaptcha())
    },
  })

  const handleSubmitChangePassword = () => {
    const { email, password, otp } = formik.values;
    mutationPostForgotPassword.mutateAsync({
      email,
      password,
      otp,
      recaptcha
    })
      .then(() => {
        onRefreshRecaptcha();
        setTimeout(() => navigate(-1), 3000);
      })
      .catch(() => onRefreshRecaptcha())
  }

  return (
    <>
      <Modal show={openModal} centered>
        <div className='p-5 d-flex flex-column align-items-center'>
          <h1 className='text-dark mb-4'>Enter OTP</h1>
          <div className='text-gray-400 fw-bold fs-4 mb-4'>
            An email sent to {formik.values.email}
          </div>
          <OTPInput
            value={formik.values.otp}
            onChange={e => formik.setFieldValue('otp', e)}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} style={inputOtpStyle} />}
          />
          <div className="d-flex flex-wrap justify-content-center pb-lg-0 mt-4">
            <ButtonLoading
              disabled={formik.values.otp.length !== 6}
              title='Submit'
              className='me-4'
              onClick={handleSubmitChangePassword}
              loading={mutationPostForgotPassword.isLoading && !!formik.values.otp}
            />
            <ButtonLoading
              title='Cancel'
              className='btn-light-primary'
              onClick={() => setOpenModal(false)}
            />
          </div>
        </div>
      </Modal>
      <GoogleReCaptchaProvider
        reCaptchaKey={recaptcha_key}
        scriptProps={{
          async: true,
          defer: true,
          appendTo: "head",
          nonce: undefined,
        }}
      >
        <form
          className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
          noValidate
          id='kt_login_password_reset_form'
          onSubmit={formik.handleSubmit}
        >
          <div className='text-center mb-10'>
            {/* begin::Title */}
            <h1 className='text-dark mb-3'>Forgot Password ?</h1>
            {/* end::Title */}

            {/* begin::Link */}
            <div className='text-gray-400 fw-bold fs-4'>Enter your email to reset your password.</div>
            {/* end::Link */}
          </div>
          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
            <input
              type='email'
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>New Password</label>
            <input
              type='password'
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                { 'is-invalid': formik.touched.password && formik.errors.password },
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm New Password</label>
            <input
              type='password'
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('confirmPassword')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                { 'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword },
                {
                  'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
                }
              )}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.confirmPassword}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
            <ButtonLoading
              className='fw-bolder me-4'
              type='submit'
              id='kt_password_reset_submit'
              title='Send mail'
              loading={mutationPostForgotPassword.isLoading && !formik.values.otp}
            />
            <Link to='/auth/login'>
              <button
                type='button'
                id='kt_login_password_reset_form_cancel_button'
                className='btn btn-lg btn-light-primary fw-bolder'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                Cancel
              </button>
            </Link>{' '}
          </div>
          {/* end::Form group */}
          <GoogleReCaptcha refreshReCaptcha={refreshReCaptcha} onVerify={verifyRecaptchaCallback} />
        </form>
      </GoogleReCaptchaProvider>
    </>
  )
})
