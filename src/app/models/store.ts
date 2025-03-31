import { Instance, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import AuthModel from "./auth.model";
import MediaModel from "./media.model";
import RoleModel from "./role.model";
import UserModel from "./user.model";
import OrganizationModel from "./organization.model";
import TopicModel from "./topic.model";
import MessageModel from "./message.model";

const RootStoreModel = types.model('RootStoreModel', {
  authModel: types.optional(AuthModel, {} as any),
  mediaModel: types.optional(MediaModel, {} as any),
  roleModel: types.optional(RoleModel, {} as any),
  userModel: types.optional(UserModel, {} as any),
  organizationModel: types.optional(OrganizationModel, {} as any),
  topicModel: types.optional(TopicModel, {} as any),
  messageModel: types.optional(MessageModel, {} as any),
});

export const rootStore = RootStoreModel.create({});
export interface IRootStore extends Instance<typeof RootStoreModel> { };
export const RootStoreContext = createContext<IRootStore>({} as IRootStore);
export const useStores = () => useContext(RootStoreContext);
export default RootStoreModel;