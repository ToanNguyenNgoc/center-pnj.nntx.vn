import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { identity, pickBy } from "lodash";

export function useQueryParams<T>() {
  const location = useLocation();
  const stringParams = location.search;
  const navigate = useNavigate();
  const queryParams = queryString.parse(stringParams);
  const query = {
    ...queryParams,
    page: isNaN(Number(queryParams.page)) ? 1 : Number(queryParams.page),
    limit: isNaN(Number(queryParams.limit)) ? 15 : Number(queryParams.limit),
  };
  function handleQueryString<TF>(key: string, value: TF) {
    const newQuery = {
      ...query,
      [key]: value,
      page: key === 'page' ? value : 1,
    }
    navigate({
      pathname: location.pathname,
      search: queryString.stringify(pickBy(newQuery, identity)),
    }, { replace: true })
  }
  return {
    query: query as unknown as T,
    handleQueryString
  }
}