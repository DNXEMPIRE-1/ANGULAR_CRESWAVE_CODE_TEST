import { TableItemConfig } from '../configs';

export abstract class TableItem {
  id?: number;

  static tableItems: () => TableItemConfig<unknown>[];
}
