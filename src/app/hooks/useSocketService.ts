/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { authHandler, baseURL } from "../configs";
import { Const } from "../common";

export function useSocketService() {
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

  const onEmitMessage = (cb: (data: any) => void) => {
    socketRef.current?.on("message", cb);
  };
  const doJoinAllTopic = ()=>{
    socketRef.current?.emit(Const.EventName.join_all);
  }

  const doJoinTopic = (topic_id: number) => {
    if (!socketRef.current) return;
    socketRef.current.emit("join", { topic_id });
  };

  const doMessage = (data: { msg: string; topic_id: number }) => {
    if (!socketRef.current) return;
    socketRef.current.emit("message", { msg: data.msg, topic_id: data.topic_id });
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    connect,
    disconnect,
    onEmitMessage,
    doJoinAllTopic,
    doJoinTopic,
    doMessage,
  };
}
