import { observer } from "mobx-react-lite";
import { ButtonLoading, Input, PermissionLayout, TitlePage } from "../../components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSocketService } from "../../hooks";
import { IResponse } from "../../interfaces";


const BrandsPage = observer(() => {
  const { connect, onEmitMessage, doMessage } = useSocketService()
  const [messages, setMessage] = useState<any[]>([])
  useEffect(() => {
    const setupSocket = async () => {
      await connect();
      onEmitMessage((data: IResponse<any>) => {
        console.log(data.context);
        setMessage((prev: any) => [...prev, data.context])
      });
    };
    setupSocket();
    return () => {
      console.log("Component unmounted, socket disconnecting...");
    };
  }, []);
  const [text, setText] = useState('')
  const onSendMessage = () => {
    doMessage({
      topic_id: 1,
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
      <div className="d-flex mt-6">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Aa..."
        />
        <ButtonLoading
          title="Send"
          type="button"
          onClick={onSendMessage}
        />
      </div>
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
      </ul>
    </div>
  )
})

export default BrandsPage;