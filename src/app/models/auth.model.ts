import { flow, types } from "mobx-state-tree";
import { AxiosConfig } from "../configs";
import { IResponse, IUserLogin, IUserProfile, ReqChangePassword, ReqPutProfile } from "../interfaces";
import { aesEncodeAuthSaveLocal } from "../utils";

const AuthModel = types.model('AuthModel', {
  profileJson: types.maybeNull(types.string),
})
  .actions(self => {
    const login = flow(function* login(body: { email: string, password: string, recaptcha:string }) {
      try {
        const response: IResponse<IUserLogin> = yield AxiosConfig().post('/auth/login', body);
        aesEncodeAuthSaveLocal(response.context.token, response.context.refresh_token, response.context.token_expired_at);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const profile = flow(function* profile(token?: string) {
      try {
        const response: IResponse<IUserProfile> = yield AxiosConfig({ token }).get('/auth/profile');
        self.profileJson = JSON.stringify(response.context);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const setProfile = (profile: IUserProfile) => {
      self.profileJson = JSON.stringify(profile);
    }
    const putProfile = flow(function* putProfile(request: ReqPutProfile) {
      try {
        const response: IResponse<IUserProfile> = yield AxiosConfig().put('/auth/profile', request);
        self.profileJson = JSON.stringify(response.context);
        return response.context;
      } catch (error) {
        throw error
      }
    })
    const postChangePassword = flow(function* postChangePassword(req: ReqChangePassword) {
      try {
        const response = yield AxiosConfig().post('/auth/change-password', req);
        return response;
      } catch (error) {
        throw error

      }
    })
    const logout = ()=>{
      self.profileJson = null
    }
    return {
      login,
      profile,
      setProfile,
      putProfile,
      postChangePassword,
      logout,
    }
  });

export default AuthModel;