import { useMutation } from "react-query";
import { IResponse, IRole, IUserProfile, ReqChangePassword, ReqForgotPassword, ReqPutProfile } from "../interfaces"
import { useStores } from "../models/store"
import { toast } from "react-toastify";
import { Const } from "../common";
import { AUTH_LOCAL_STORAGE_KEY } from "../modules/auth";

export function useAuth() {
  const { authModel } = useStores()
  let profile: IUserProfile | null = null;
  let roles: IRole[] = [];
  try {
    profile = JSON.parse(String(authModel.profileJson));
    roles = profile?.roles || []
  } catch (error) { }
  const mutationPutProfile = useMutation<IResponse<IUserProfile>, unknown, ReqPutProfile>({
    //@ts-ignore
    mutationFn: (body) => authModel.putProfile(body),
    onSuccess: () => toast('Update success', { type: 'success' }),
    onError: () => toast('Update failed', { type: 'error' }),
  })
  const mutationPostChangePassword = useMutation<any, unknown, ReqChangePassword>({
    mutationFn: body => authModel.postChangePassword(body),
    onSuccess(data, variables, context) {
      toast.success('Change password success');
    },
    onError(error: any, variables, context) {
      toast.error(error.data.message || 'Change password failed')
    },
  })
  const mutationPostForgotPassword = useMutation<IResponse<any>, unknown, ReqForgotPassword>({
    mutationFn: (body) => authModel.postForgotPassword(body),
    onSuccess(data, variables, context) {
      toast.success(variables.password ? 'Change password success' : 'Send mail success')
    },
    onError(error, variables, context) {
      toast.error(variables.otp ? 'Change password failed' : 'An error when send OTP to mail')
    },
  })
  const logout = () => {
    localStorage.removeItem(Const.StorageKey.sig);
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    authModel.logout();
    window.location.reload()
  }
  return {
    profile,
    roles,
    setProfile: authModel.setProfile,
    putProfile: authModel.putProfile,
    mutationPutProfile,
    mutationPostChangePassword,
    mutationPostForgotPassword,
    logout
  }
}