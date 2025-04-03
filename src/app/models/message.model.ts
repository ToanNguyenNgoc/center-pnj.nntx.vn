import { flow, types } from "mobx-state-tree";
import { IMessage, IResponse, IResponsePagination, QrMessage } from "../interfaces";
import { AxiosConfig } from "../configs";

export const MessageModel = types
  .model('MessageModel', {
    messageJon: types.maybeNull(types.string),
  })
  .actions(self => {
    const getMessages = flow(function* getMessages(params: QrMessage) {
      const response: IResponse<IResponsePagination<IMessage[]>> = yield AxiosConfig().get('/messages', { params });
      return response.context;
    })
    //listener message global
    const setMessageJson = (dataJson: string) => self.messageJon = dataJson
    const deleteMessageJson = () => self.messageJon = null
    const deleteMessage = flow(function* deleteMessage(id: number) {
      const response: IResponse<any> = yield AxiosConfig().delete(`/messages/${id}`);
      return response
    })
    return {
      getMessages,
      setMessageJson,
      deleteMessageJson,
      deleteMessage
    }
  })

export default MessageModel;