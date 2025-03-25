import { flow, types } from "mobx-state-tree";
import { AxiosConfig } from "../configs";
import { IPermission, IResponse, IResponsePagination, IRole, ReqRole } from "../interfaces";

const RoleModel = types
  .model('RoleModel', {})
  .actions(self => {
    const getPermissions = flow(function* getPermissions() {
      try {
        const response: IResponse<IResponsePagination<IPermission[]>> = yield AxiosConfig().get('/permissions');
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const getRoles = flow(function* getRoles() {
      try {
        const response: IResponse<IResponsePagination<IRole[]>> = yield AxiosConfig().get('/roles');
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const getRole = flow(function* getRole(id: number) {
      try {
        const response: IResponse<IRole> = yield AxiosConfig().get(`/roles/${id}`);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const postRole = flow(function* postRole(req: ReqRole) {
      try {
        const response = yield AxiosConfig().post('/roles', req);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const putRole = flow(function* postRole(id:number,req: ReqRole) {
      try {
        const response = yield AxiosConfig().patch(`/roles/${id}`, req);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    return {
      getPermissions,
      getRoles,
      getRole,
      postRole,
      putRole
    }
  })

export default RoleModel;