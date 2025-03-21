import { useMutation } from "react-query";
import { IResponse, IRole, IUserProfile, ReqChangePassword, ReqPutProfile } from "../interfaces"
import { useStores } from "../models/store"
import { toast } from "react-toastify";

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
    onError(error:any, variables, context) {
      toast.error(error.data.message || 'Change password failed')
    },
  })
  return {
    profile,
    roles,
    setProfile: authModel.setProfile,
    putProfile: authModel.putProfile,
    mutationPutProfile,
    mutationPostChangePassword
  }
}