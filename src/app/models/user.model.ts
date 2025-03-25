import { flow, types } from "mobx-state-tree";
import { IResponse, IResponsePagination, IUserProfile, QrUser, ReqPostUser } from "../interfaces";
import { AxiosConfig } from "../configs";

export const UserModel = types
  .model('UserModel', {})
  .actions(self => {
    const getUsers = flow(function* getUsers(qr: QrUser) {
      try {
        const response: IResponse<IResponsePagination<IUserProfile[]>> = yield AxiosConfig().get('/users', { params: qr });
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const getUser = flow(function* getUser(id) {
      try {
        const response: IResponse<IUserProfile> = yield AxiosConfig().get(`/users/${id}`);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const postUser = flow(function* postUser(body: ReqPostUser) {
      try {
        const response: IResponse<IUserProfile> = yield AxiosConfig().post('/users', body);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const patchUser = flow(function* patchUser(id: number, body: ReqPostUser) {
      try {
        const response: IResponse<IUserProfile> = yield AxiosConfig().patch(`/users/${id}`, body);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const deleteUser = flow(function* deleteUser(id: number) {
      const response: IResponse<[]> = yield AxiosConfig().delete(`/users/${id}`);
      return response.context;
    })
    return {
      getUsers,
      getUser,
      postUser,
      patchUser,
      deleteUser
    }
  })

export default UserModel;