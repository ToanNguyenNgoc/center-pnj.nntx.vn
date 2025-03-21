import { Instance, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import AuthModel from "./auth.model";
import MediaModel from "./media.model";

const RootStoreModel = types.model('RootStoreModel', {
  authModel: types.optional(AuthModel, {} as any),
  mediaModel: types.optional(MediaModel, {} as any),
});

export const rootStore = RootStoreModel.create({});
export interface IRootStore extends Instance<typeof RootStoreModel> { };
export const RootStoreContext = createContext<IRootStore>({} as IRootStore);
export const useStores = () => useContext(RootStoreContext);
export default RootStoreModel;