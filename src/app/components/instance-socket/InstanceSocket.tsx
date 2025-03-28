/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from "mobx-react-lite";
import { useAuth, useSocketService } from "../../hooks";
import { useEffect } from "react";

export const InstanceSocket = observer(()=>{
  const {profile} = useAuth();
  const {connect, disconnect} = useSocketService();
  useEffect(()=>{
    const setupSocket = async ()=>{
      if(!profile?.id) return;
      await connect();
      return ()=>{
        disconnect();
      }
    }
    setupSocket();
  },[profile?.id])
  return null;
})