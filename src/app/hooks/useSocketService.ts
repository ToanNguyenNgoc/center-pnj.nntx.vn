/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { authHandler, baseURL } from "../configs";
import { Const, WS_EVENT_NAME } from "../common";

export function useSocketService(isInstance=true) {
  const socketRef = useRef<Socket | null>(null);

  const connect = async () => {
    if (socketRef.current) return socketRef.current;

    const token = await authHandler();

    return new Promise<Socket>((resolve, reject) => {
      try {
        socketRef.current = io(baseURL, {
          extraHeaders: {
            Authorization: token,
          },
          reconnection:true,
          reconnectionAttempts:100,
          reconnectionDelay:2000
        });

        socketRef.current.on("connect", () => {
          console.log("Connected to WebSocket");
          doJoinAllTopic();
          resolve(socketRef.current!);
        });

        socketRef.current.on("connect_error", (err) => {
          console.error("WebSocket Connection Error:", err);
          reject(err);
        });
      } catch (error) {
        console.error("WebSocket Exception:", error);
        reject(error);
      }
    });
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const onListenerTopicCreated = (cb: (data: any) => void) => {
    socketRef.current?.on(WS_EVENT_NAME.receive_topic, cb)
  }
  const onListenerMessage = (cb: (data: any) => void) => {
    socketRef.current?.on(WS_EVENT_NAME.message, cb);
  };
  const onListenerTyping = (cb: (data: any) => void) => {
    socketRef.current?.on(WS_EVENT_NAME.typing, cb)
  }
  //[DO ACTION]
  const doCreateTopic = (body: { recipient_id: number; group_name: string; msg?: string; media_id?: number; }) => {
    if (!socketRef.current) return;
    socketRef.current.emit(WS_EVENT_NAME.create_topic, body)
  }
  const doJoinAllTopic = () => {
    socketRef.current?.emit(Const.EventName.join_all);
  }
  const doJoinTopic = (topic_id: number) => {
    if (!socketRef.current) return;
    socketRef.current.emit(WS_EVENT_NAME.join, { topic_id });
  };

  const doMessage = (data: { msg: string; topic_id: number }) => {
    if (!socketRef.current) return;
    socketRef.current.emit(WS_EVENT_NAME.message, { msg: data.msg, topic_id: data.topic_id });
  };

  const doTyping = (data: { is_typing: boolean, topic_id: number }) => {
    if (!socketRef.current) return;
    socketRef.current.emit(WS_EVENT_NAME.typing, data)
  }

  useEffect(() => {
    if(isInstance){
      connect();
    }
    // return () => {
    //   disconnect();
    // };
  }, []);

  return {
    connect,
    disconnect,
    onListenerTopicCreated,
    onListenerMessage,
    onListenerTyping,

    doCreateTopic,
    doJoinAllTopic,
    doJoinTopic,
    doMessage,
    doTyping
  };
}
