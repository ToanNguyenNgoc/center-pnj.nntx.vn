import { flow, types } from "mobx-state-tree";
import { IMessage, IResponse, IResponsePagination, QrMessage } from "../interfaces";
import { AxiosConfig } from "../configs";

export const MessageModel = types
  .model('MessageModel')
  .actions(self => {
    const getMessages = flow(function* getMessages(params: QrMessage) {
      const response: IResponse<IResponsePagination<IMessage[]>> = yield AxiosConfig().get('/messages', { params });
      return response.context;
    })
    return {
      getMessages
    }
  })

export default MessageModel;