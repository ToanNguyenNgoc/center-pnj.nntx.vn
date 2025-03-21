export interface IResponse<T> {
  context: T,
  statusCode: number
}

export interface IResponsePagination<T> {
  data: T,
  total: number;
  total_page: number;
  prev_page: number;
  current_page: number;
  next_page: number;
}