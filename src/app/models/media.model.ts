import { flow, types } from "mobx-state-tree";
import { AxiosConfig } from "../configs";
import { IMedia, IResponse } from "../interfaces";

const MediaModel = types
  .model('MediaModel', {})
  .actions(self => {
    const postMedia = flow(function* postMedia(formData: FormData) {
      try {
        const response: IResponse<IMedia> = yield AxiosConfig().post('/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.context
      } catch (error) {
        throw error;
      }
    })
    return {
      postMedia
    }
  })

export default MediaModel