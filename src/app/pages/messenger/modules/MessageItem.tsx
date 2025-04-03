import clsx from "clsx";
import { FC, useState } from "react";
import { Avatar, DropMenu, RenderMedia } from "../../../components";
import { IMessage, IUserProfile } from "../../../interfaces";
import { formatDate } from "../../../utils";
import { useStores } from "../../../models/store";

export const MessageItem: FC<{ message: IMessage, profile: IUserProfile, isDrawer?: boolean }> = ({ message, profile, isDrawer }) => {
  const [active, setActive] = useState(message.active)
  const { messageModel } = useStores();
  const type = message.user?.id === profile.id ? 'out' : 'in';
  const state = type === 'in' ? 'info' : 'primary'
  const templateAttr = {}
  const contentClass = `${isDrawer ? '' : 'd-flex'} justify-content-${type === 'in' ? 'start' : 'end'} mb-10`;
  const onRemoveMessage = () => {
    setActive(false);
    messageModel.deleteMessage(message.id);
  }
  return (
    <div
      className={clsx('d-flex', contentClass, 'mb-10')}
      {...templateAttr}
    >
      {
        (type === 'out' && active) ?
          <DropMenu>
            <div>
              <div className="btn btn-outline-danger btn-sm" onClick={onRemoveMessage}>
                Thu hồi
              </div>
            </div>
          </DropMenu>
          :
          null
      }
      <div
        className={clsx(
          'd-flex flex-column align-items',
          `align-items-${type === 'in' ? 'start' : 'end'}`
        )}
      >
        <div className='d-flex align-items-center mb-2'>
          {type === 'in' ? (
            <>
              <div className='symbol  symbol-35px symbol-circle '>
                <Avatar imageUrl={message.user?.media?.original_url} size={35} type="circle" />
              </div>
              <div className='ms-3'>
                <div
                  className='fs-5 fw-bolder text-gray-900 text-hover-primary me-1'
                >
                  {message.user?.fullname}
                </div>
                <span className='text-muted fs-7 mb-1'>{formatDate(message.createdAt)}</span>
              </div>
            </>
          ) : (
            <>
              <div className='me-3'>
                <span className='text-muted fs-7 mb-1'>{formatDate(message.createdAt)}</span>
              </div>
              <div className='symbol  symbol-35px symbol-circle '>
                <Avatar imageUrl={profile?.media?.original_url} size={35} type="circle" />
              </div>
            </>
          )}
        </div>
        <div
          className={clsx(
            'p-5 rounded',
            `bg-light-${state}`,
            'text-dark fw-bold mw-lg-600px',
            `text-${type === 'in' ? 'start' : 'end'}`
          )}
        >
          {
            active ?
              <>
                <div
                  data-kt-element="message-text"
                  dangerouslySetInnerHTML={{ __html: message.msg }}
                />
                <div className="d-flex flex-wrap justify-content-end">
                  {message.medias.map((media) => (
                    <div
                      key={media.id}
                      className="position-relative m-2"
                      style={{ width: 150, aspectRatio: '1 / 1' }}
                    >
                      <RenderMedia fileUrl={media.original_url} fileType={media.mime_type} />
                    </div>
                  ))}
                </div>
              </>
              :
              <span style={{ fontStyle: 'italic', color: 'var(--kt-gray-500)' }}>Tin nhắn đã thu hồi</span>
          }
        </div>

      </div>
    </div>
  )
}