import { flow, types } from "mobx-state-tree";
import { IOrganization, IOrganizationContactType, IResponse, IResponsePagination, ReqPostOrganization } from "../interfaces";
import { AxiosConfig } from "../configs";

const OrganizationModel = types
  .model('OrganizationModel', {})
  .actions(self => {
    const getOrgs = flow(function* getOrgs() {
      const response: IResponse<IResponsePagination<IOrganization[]>> = yield AxiosConfig().get('/organizations');
      return response.context
    })
    const getOrg = flow(function* getOrg(id: number) {
      const response: IResponse<IOrganization> = yield AxiosConfig().get(`/organizations/${id}`);
      return response.context;
    })
    const postOrg = flow(function* postOrg(data: ReqPostOrganization) {
      const response: IResponse<IOrganization> = yield AxiosConfig().post('/organizations', data);
      return response.context;
    })
    const patchOrg = flow(function* patchOrg(id: number, data: ReqPostOrganization) {
      const response: IResponse<IOrganization> = yield AxiosConfig().patch(`/organizations/${id}`, data);
      return response.context;
    })
    const deleteOrg = flow(function* deleteOrg(id) {
      const response: IResponse<[]> = yield AxiosConfig().delete(`/organizations/${id}`);
      return response.context;
    })
    const getOrgContactTypes = flow(function* getOrgContactType() {
      const response: IResponse<IOrganizationContactType[]> = yield AxiosConfig().get('/organizations-contacts/contact-types');
      return response.context
    })
    return {
      getOrgs,
      getOrg,
      postOrg,
      patchOrg,
      deleteOrg,
      getOrgContactTypes
    }
  })

export default OrganizationModel;

