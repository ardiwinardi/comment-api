export interface Meta {
  total: number;
  limit: number;
  start: number;
}
export interface DataWithMeta<T> {
  data: T;
  meta: Meta;
}
