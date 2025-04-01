/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from "mobx-react-lite";
import { useAuth, useGetTopicMessageGlobal, useSocketService } from "../../hooks";
import { FC, useEffect } from "react";
import { useStores } from "../../models/store";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { aesEncode } from "../../utils";

export const InstanceSocket = observer(() => {
  const { profile } = useAuth();
  const { messageModel } = useStores();
  const { connect, disconnect, onListenerMessageGlobal } = useSocketService();
  useEffect(() => {
    const setupSocket = async () => {
      if (!profile?.id) return;
      await connect();
      onListenerMessageGlobal((data) => {
        if (data.context) {
          messageModel.setMessageJson(JSON.stringify(data.context))
        }
      })
      return () => {
        disconnect();
      }
    }
    setupSocket();
  }, [profile?.id])
  return null;
})

export const NotificationMessage: FC = observer(() => {
  const { profile } = useAuth();
  const { messageGlobal, deleteMessageJson } = useGetTopicMessageGlobal()
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (messageGlobal && !location.pathname.includes('/apps/messengers')) {
      toast.success(`${messageGlobal.user.fullname} gửi tin nhắn: ${messageGlobal.msg || 'Đã gửi hình ảnh'}`, {
        style: { cursor: 'pointer' },
        theme: 'light',
        position: 'top-right',
        onClick() {
          navigate(`/apps/messengers/${aesEncode(String(messageGlobal.topic?.id))}`);
          toast.dismiss();
        },
        autoClose: false,
      })
    }
    return () => {
      deleteMessageJson()
    }
  }, [location.pathname, messageGlobal, profile?.id])
  return null
})