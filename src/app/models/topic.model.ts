import { flow, types } from "mobx-state-tree";
import { IResponse, IResponsePagination, ITopic, QrTopic, ReqPostTopic } from "../interfaces";
import { AxiosConfig } from "../configs";

export const TopicModel = types
  .model("TopicModel", {})
  .actions(self => {
    const getTopics = flow(function* getTopics(qr: QrTopic) {
      const response: IResponse<IResponsePagination<ITopic[]>> = yield AxiosConfig().get('/topics', { params: qr });
      return response.context
    })
    const getTopic = flow(function* getTopic(id: number) {
      const response: IResponse<ITopic> = yield AxiosConfig().get(`/topics/${id}`);
      return response.context;
    })
    const postTopic = flow(function* postTopic(data: ReqPostTopic) {
      const response: IResponse<ITopic> = yield AxiosConfig().post(`/topics`, data);
      return response.context;
    })
    return {
      getTopics,
      getTopic,
      postTopic
    }
  })

export default TopicModel;