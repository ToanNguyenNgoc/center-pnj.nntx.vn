import { IMessage } from "../interfaces"
import { useStores } from "../models/store"

export function useGetTopicMessageGlobal() {
  let messageGlobal: IMessage | undefined = undefined
  const { messageModel } = useStores();
  try {
    messageGlobal = JSON.parse(String(messageModel.messageJon))
  } catch (error) { }
  return {
    messageGlobal,
    topic: messageGlobal?.topic,
    deleteMessageJson:messageModel.deleteMessageJson
  }
}