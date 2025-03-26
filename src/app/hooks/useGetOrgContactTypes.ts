import { useQuery } from "react-query"
import { useStores } from "../models/store"
import { Const } from "../common"

export function useGetOrgContactTypes() {
  const { organizationModel } = useStores()
  const query = useQuery({
    queryKey: ['organizationModel.getOrgContactTypes'],
    queryFn: () => organizationModel.getOrgContactTypes(),
    staleTime: Const.QueryKey.staleTime
  })
  return Object.assign(query, {
    types: query.data || []
  })
}