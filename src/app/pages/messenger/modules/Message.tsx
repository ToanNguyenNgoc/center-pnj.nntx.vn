/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef, useState } from "react";
import { useAuth, usePostMedia, useSocketService } from "../../../hooks";
import { acceptMedia, aesDecode } from "../../../utils";
import { useInfiniteQuery, useQuery } from "react-query";
import { Const } from "../../../common";
import { useStores } from "../../../models/store";
import { isNaN } from "formik";
import { IMedia, IMessage, IResponse, ITopic, IUserProfile } from "../../../interfaces";
import { ButtonUpload, RenderMedia } from "../../../components";
import InfiniteScroll from "react-infinite-scroll-component";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useParams } from "react-router-dom";
import { MessageEmpty } from "./MessageEmpty";
import { MessageItem } from "./MessageItem";
import { MessageHeader } from "./MessageHeader";

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
        <MessageHeader topic={dataTopic} profile={profile} />
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
  const { data, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [Const.QueryKey.messages, topic.id],
    queryFn: ({ pageParam = 1 }) => messageModel.getMessages({ page: pageParam, limit: 10, topic_id: topic.id, sort: '-createdAt' }),
    getNextPageParam: (params: any) => {
      return params.current_page + 1
    }
  })
  const dataMessage = data?.pages.flatMap((page: any) => page.data) || []
  //
  const scrollBottom = (options?: ScrollToOptions) => {
    if (!scrollableDivRef.current) return;
    scrollableDivRef.current.scrollTo(options);
  }
  const { connect, doMessage, doTyping, onListenerMessage, onListenerTyping } = useSocketService();
  useEffect(() => {
    const onListener = async () => {
      await connect();
      onListenerMessage((data: IResponse<IMessage>) => {
        if (data.context) {
          console.log(data.context);
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
  const listMessage = messages.concat(dataMessage || [])

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
  const handleChangeMedia = (files: FileList) => {
    handlePostMedia({
      files,
      callBackLocal(medias) {
        setImages(prev => [...medias, ...prev])
      },
    })
  }
  const onRemoveImage = (index: number) => setImages(prev => prev.filter((_i, i) => i !== index))
  console.log(listMessage);

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
            //@ts-ignore
            dataLength={listMessage.length}
            next={() => fetchNextPage()}
            style={{ display: 'flex', flexDirection: 'column-reverse', }}
            inverse={true} //
            hasMore={true}
            loader={(isFetchingNextPage || isLoading) ? <p className="text-center">Đang tải tin nhắn...</p> : <div />}
            scrollableTarget="scrollableDiv"
          >
            <Typing userTyping={userTyping} />
            {listMessage.map((message, index) => (
              <MessageItem key={message.id} message={message} profile={profile} isDrawer={isDrawer} />
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
                <div key={index} style={{ width: 140, aspectRatio: '1 / 1' }} className="position-relative me-4">
                  <RenderMedia fileUrl={image.original_url} fileType={image.mime_type} />
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
            <ButtonUpload onChangeFile={file => handleChangeMedia(file)} options={{ multiple: true, accept: acceptMedia.imageVideo }} />
            <ButtonUpload
              className="ms-2" id="file"
              onChangeFile={file => handleChangeMedia(file)}
              options={{ multiple: true }}
              icon={<i className='bi bi-paperclip fs-3'></i>}
            />
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