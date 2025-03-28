import { observer } from "mobx-react-lite";
import { ButtonLoading, Input, PermissionLayout, TitlePage } from "../../components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, useSocketService } from "../../hooks";
import { IResponse, IUserProfile } from "../../interfaces";

const topic_id = 1;

const BrandsPage = observer(() => {
  const { profile } = useAuth()
  const {
    connect,
    onListenerTopicCreated, onListenerMessage, onListenerTyping,
    doCreateTopic, doMessage, doTyping,
  } = useSocketService()
  const [messages, setMessage] = useState<any[]>([])
  const [userTyping, setUserTyping] = useState<IUserProfile>()
  useEffect(() => {
    const setupSocket = async () => {
      await connect();
      onListenerTopicCreated((data: any) => {
        console.log(data)
      })
      onListenerMessage((data: IResponse<any>) => {
        console.log(data.context);
        setMessage((prev: any) => [...prev, data.context])
      });
      onListenerTyping((data: IResponse<any>) => {
        console.log(data.context);
        if (data.context.is_typing) {
          setUserTyping(data.context.user);
        } else {
          setUserTyping(undefined);
        }
      })
    };
    setupSocket();
    return () => {
      console.log("Component unmounted, socket disconnecting...");
    };
  }, []);
  const [text, setText] = useState('')
  const onSendMessage = () => {
    doMessage({
      topic_id,
      msg: text
    });
    setText('')
  }
  return (
    <div className="card p-3">
      <TitlePage title="Thương hiệu" element={
        <PermissionLayout permissions={['.brands.post']}>
          <Link to={'/brands-form'} className="btn btn-primary">Tạo mới</Link>
        </PermissionLayout>
      } />
      <ul>
        {
          messages.map((message: any, index) => (
            <li key={index}>
              <div>
                <span className="fw-bold me-2">{message.user?.fullname}:</span>
                <span>{message.msg}</span>
              </div>
            </li>
          ))
        }
        {
          (userTyping && userTyping.id !== profile?.id) &&
          <li><span className="fw-bold">{userTyping.fullname} typing...</span></li>
        }
      </ul>
      <div className="d-flex mt-6">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Aa..."
          onFocus={() => doTyping({ is_typing: true, topic_id })}
          onBlur={() => doTyping({ is_typing: false, topic_id })}
        />
        <ButtonLoading
          title="Send"
          type="button"
          onClick={onSendMessage}
        />
      </div>
      <ButtonLoading
        title="create topic"
        type="button"
        onClick={() => doCreateTopic({
          recipient_id: 6,
          media_id: 1,
          msg: 'OK',
          group_name: 'group name'
        })}
      />
    </div>
  )
})

export default BrandsPage;