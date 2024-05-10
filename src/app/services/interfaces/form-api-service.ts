import { PaginatedResult, PaginationOptions, PostReturn, TableItem } from 'src/app/models';

export interface FormApiService<T extends TableItem> {
  getById(id: number): Promise<T>;
  getPaginated(options: PaginationOptions): Promise<PaginatedResult<T>>;
  insert(item: Partial<T>): Promise<PostReturn>;
  duplicate?(item: Partial<T>): Promise<PostReturn>;
  update(item: Partial<T>): Promise<void>;
  remove(id: number): Promise<void>;
}
