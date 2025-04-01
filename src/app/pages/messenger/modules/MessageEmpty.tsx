import { FC } from "react";

export const MessageEmpty: FC = () => {
  const isDrawer = false;
  return (
    <div className='flex-lg-row-fluid ms-lg-7 ms-xl-10'>
      <div className='card' id='kt_chat_messenger'>
        <div className='card-header' id='kt_chat_messenger_header'>
          <div className='card-title'>
            <div className='symbol-group symbol-hover'></div>
            <div className='d-flex justify-content-center flex-column me-3'>
              <div
                className='fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1'
              >
              </div>
              <div className='mb-0 lh-1'>
                <span className='badge badge-success badge-circle w-10px h-10px me-1'></span>
              </div>
            </div>
          </div>

          <div className='card-toolbar'>
            <div className='me-n3'>
              <button
                className='btn btn-sm btn-icon btn-active-light-primary'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-end'
                data-kt-menu-flip='top-end'
              >
                <i className='bi bi-three-dots fs-2'></i>
              </button>
            </div>
          </div>
        </div>
        <div
          className='card-body'
          id={isDrawer ? 'kt_drawer_chat_messenger_body' : 'kt_chat_messenger_body'}
        >
          <div>
            <div
              id="scrollableDiv"
              style={{
                height: '55vh',
              }}
            >
            </div>
          </div>
          <div
            className='card-footer pt-4'
            id={isDrawer ? 'kt_drawer_chat_messenger_footer' : 'kt_chat_messenger_footer'}
          >
            <textarea
              className='form-control form-control-flush mb-3'
              rows={1}
              data-kt-element='input'
              placeholder='Type a message'
            />
            <div className='d-flex flex-stack'>
              <div className='d-flex align-items-center me-2'>
                <button
                  className='btn btn-sm btn-icon btn-active-light-primary me-1'
                  type='button'
                  data-bs-toggle='tooltip'
                  title='Coming soon'
                >
                  <i className='bi bi-paperclip fs-3'></i>
                </button>
                <button
                  className='btn btn-sm btn-icon btn-active-light-primary me-1'
                  type='button'
                  data-bs-toggle='tooltip'
                  title='Coming soon'
                >
                  <i className='bi bi-upload fs-3'></i>
                </button>
              </div>
              <button
                className='btn btn-primary'
                type='button'
                data-kt-element='send'
                disabled
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}