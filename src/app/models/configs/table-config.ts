import { PipeTransform, ProviderToken } from '@angular/core';
import { Ctor } from './api-request';
import { CSSProps } from '../types';

export interface TableConfig<T = unknown> {
  itemConfigs: TableItemConfig<T>[];
  orderBy: OrderByConfig<T> | null;
  detailsUrl: string;
  itemType?: Ctor<T>;
  hasCopy?: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
  hasView?: boolean;
}

export interface TableItemConfig<T = unknown> {
  header: string;
  key: TableKey<T>;
  hiddenInLowRes?: boolean;
  disabledOrderBy?: boolean;
  defaultsTo?: unknown;
  pipe?: ProviderToken<PipeTransform>;
  pipeArgs?: unknown[];
  styles?: CSSProps;
}

export interface OrderByConfig<T = unknown> {
  key: TableKey<T>;
  direction: 'asc' | 'desc';
}

export type TableKey<T = unknown> = (keyof T & string) | [keyof T & string, string];
