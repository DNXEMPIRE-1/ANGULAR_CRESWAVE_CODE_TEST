export interface PaginatedResult<T = unknown> {
  total: number;
  items: T[];
}
