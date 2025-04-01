/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useAuth, usePostMedia, useSocketService } from "../../../hooks";
import { aesDecode, formatDate } from "../../../utils";
import { useQuery } from "react-query";
import { Const } from "../../../common";
import { useStores } from "../../../models/store";
import { isNaN } from "formik";
import { GetTopicName } from "./Topic";
import { IMedia, IMessage, IResponse, ITopic, IUserProfile } from "../../../interfaces";
import { Avatar } from "../../../components";
import InfiniteScroll from "react-infinite-scroll-component";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useParams } from "react-router-dom";
import { MessageEmpty } from "./MessageEmpty";

export const Message: FC = observer(() => {
  const { profile } = useAuth();
  const { topicModel } = useStores();
  const params = useParams();
  const topicId = Number(aesDecode(`${params.id}`));
  const { data: dataTopic } = useQuery({
    queryKey: [Const.QueryKey.topics, topicId],
    queryFn: () => topicModel.getTopic(topicId),
    enabled: !isNaN(topicId) && topicId !== 0,
    staleTime: Const.QueryKey.staleTime
  })
  if (!dataTopic || !profile) return <MessageEmpty />;
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
                {GetTopicName(dataTopic, Number(profile?.id))}
              </div>

              <div className='mb-0 lh-1'>
                <span className='badge badge-success badge-circle w-10px h-10px me-1'></span>
                <span className='fs-7 fw-bold text-gray-400'>Active</span>
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
              {/* <Dropdown1 /> */}
            </div>
          </div>
        </div>
        <ChatInner topic={dataTopic} profile={profile} topicId={topicId} />
      </div>
    </div>
  )
})

type Props = {
  isDrawer?: boolean;
  topic: ITopic;
  profile: IUserProfile;
  topicId: number
}

const ChatInner: FC<Props> = observer(({ isDrawer, topic, profile, topicId }) => {
  const { messageModel } = useStores();
  const { handlePostMedia } = usePostMedia();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [userTyping, setUserTyping] = useState<IUserProfile>();
  const [body, setBody] = useState<{ msg: string, media_id?: number }>({ msg: '', media_id: undefined });
  const { data: dataMessage } = useQuery({
    queryKey: [Const.QueryKey.messages, topic.id],
    queryFn: () => messageModel.getMessages({ page: 1, limit: 15, topic_id: topic.id, sort: '-createdAt' }),
  })
  const scrollBottom = (options?: ScrollToOptions) => {
    if (!scrollableDivRef.current) return;
    scrollableDivRef.current.scrollTo(options);
  }
  const { connect, doMessage, doTyping, onListenerMessage, onListenerTyping, doCreateTopic } = useSocketService();
  useEffect(() => {
    const onListener = async () => {
      await connect();
      onListenerMessage((data: IResponse<IMessage>) => {
        if (data.context) {
          setMessages(prev => [data.context, ...prev])
          setTimeout(() => scrollBottom({ top: 0, behavior: 'smooth' }), 100)
        }
      })
      onListenerTyping((data: IResponse<{ is_typing: boolean, user: IUserProfile }>) => {
        if (!data.context || !data.context.is_typing || data.context.user?.id === profile?.id) {
          return setUserTyping(undefined)
        }
        setUserTyping(data.context.user)
      })
    }
    onListener()
  }, [])
  useEffect(() => {
    setMessages([])
  }, [topicId])

  const sendMessage = async () => {
    if (body.msg.trim().length === 0 && images.length === 0) return;
    let media_ids: number[] = [];
    if (images.length > 0) {
      const medias = await handlePostMedia({
        //@ts-ignore
        files: images.map(i => i.file).filter(Boolean),
        callBackApi() { },
      })
      //@ts-ignore
      media_ids = medias?.map(i => i.id).filter(Boolean)
    }
    doMessage({
      msg: body.msg,
      topic_id: topic.id,
      media_ids
    })
    setBody({ msg: '', media_id: undefined })
    setImages([])
  }
  const listMessage = messages.concat(dataMessage?.data || [])

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault()
      sendMessage()
    }
  }
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  //[Handle]: media
  const [images, setImages] = useState<IMedia[]>([]);
  const handlePaste = (event: any) => {
    const items = event.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        handlePostMedia({
          //@ts-ignore
          files: [file],
          callBackLocal(medias) {
            setImages(prev => [...medias, ...prev])
          },
        })
      }
    }
  };
  const onRemoveImage = (index: number) => setImages(prev => prev.filter((_i, i) => i !== index))

  return (
    <div
      className='card-body'
      id={isDrawer ? 'kt_drawer_chat_messenger_body' : 'kt_chat_messenger_body'}
    >
      <div>
        <div
          ref={scrollableDivRef}
          id="scrollableDiv"
          style={{
            height: '55vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
        >
          <InfiniteScroll
            dataLength={Number(dataMessage?.total || 0)}
            next={() => console.log("More...")}
            style={{ display: 'flex', flexDirection: 'column-reverse', }}
            inverse={true} //
            hasMore={true}
            loader={<></>}
            scrollableTarget="scrollableDiv"
          >
            <Typing userTyping={userTyping} />
            {listMessage.map((message, index) => (
              <MessageItem key={index} message={message} profile={profile} isDrawer={isDrawer} />
            ))}
          </InfiniteScroll>
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
          value={body.msg}
          onChange={(e) => setBody(prev => ({ ...prev, msg: e.target.value }))}
          onPaste={handlePaste}
          onKeyDown={onEnterPress}
          onFocus={() => doTyping({ is_typing: true, topic_id: topic.id })}
          onBlur={() => doTyping({ is_typing: false, topic_id: topic.id })}
        />
        <div className="overflow-scroll">
          <div className="d-flex with-max-content">
            {
              images.map((image, index) => (
                <div key={index} style={{ width: 100, aspectRatio: '1 / 1' }} className="position-relative me-4">
                  <img className="position-absolute top-0 start-0 w-100 h-100 rounded-2 object-fit-cover" src={image.original_url} alt="" />
                  <div onClick={() => onRemoveImage(index)} className="position-absolute bg-secondary rounded-circle end-0 btn p-0" style={{ zIndex: 10 }}>
                    <img src={toAbsoluteUrl("/media/icons/duotune/general/gen040.svg")} alt="" />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
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
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
})

const MessageItem: FC<{ message: IMessage, profile: IUserProfile, isDrawer?: boolean }> = ({ message, profile, isDrawer }) => {
  const type = message.user?.id === profile.id ? 'out' : 'in';
  const state = type === 'in' ? 'info' : 'primary'
  const templateAttr = {}
  const contentClass = `${isDrawer ? '' : 'd-flex'} justify-content-${type === 'in' ? 'start' : 'end'
    } mb-10`
  return (
    <div
      className={clsx('d-flex', contentClass, 'mb-10')}
      {...templateAttr}
    >
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
                <img
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-2 object-fit-cover"
                  src={media.original_url}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const Typing: FC<{ userTyping?: IUserProfile }> = ({ userTyping }) => {
  if (!userTyping) return null;
  return (
    <div className="position-absolute top-160 start-6">
      <div>
        <span className="fw-bold">{userTyping.fullname}</span> đang nhắn...
      </div>
    </div>
  )
}