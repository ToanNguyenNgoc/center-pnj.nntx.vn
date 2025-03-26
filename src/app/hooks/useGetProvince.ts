import { useQuery } from "react-query";
import { Const } from "../common";
import { AxiosConfig } from "../configs";
import { IDistrict, IProvince, IResponse, IResponsePagination, IWard } from "../interfaces";

interface UseGetProvinceOptions {
  province_code?: number;
  district_code?: number;
}

export function useGetProvince(options?: UseGetProvinceOptions) {
  const { data: dataProvinces } = useQuery<IResponse<IResponsePagination<IProvince[]>>>({
    queryKey: [Const.QueryKey.provinces],
    queryFn: () => AxiosConfig().get('/provinces'),
    staleTime: Const.QueryKey.staleTime
  })

  const { data: dataDistricts } = useQuery<IResponse<IResponsePagination<IDistrict[]>>>({
    queryKey: [Const.QueryKey.provinces, options?.province_code],
    queryFn: () => AxiosConfig().get(`/provinces/${options?.province_code}/districts`),
    enabled: !!options?.province_code,
    staleTime: Const.QueryKey.staleTime
  })

  const { data: dataWards } = useQuery<IResponse<IResponsePagination<IWard[]>>>({
    queryKey: [Const.QueryKey.districts, options?.district_code],
    queryFn: () => AxiosConfig().get(`/districts/${options?.district_code}/wards`),
    enabled: !!options?.district_code,
    staleTime: Const.QueryKey.staleTime
  })
  return {
    provinces: dataProvinces?.context.data || [],
    districts: dataDistricts?.context.data || [],
    wards: dataWards?.context.data || []
  }
}