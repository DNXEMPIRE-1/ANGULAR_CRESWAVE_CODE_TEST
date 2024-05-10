import { ODataFilter } from './odata-filter';
import { ODataOrderBy } from './odata-types';

export interface ODataOptions {
  select?: string[];
  expand?: string[];
  filter?: ODataFilter;
  top?: number;
  skip?: number;
  orderBy?: ODataOrderBy | ODataOrderBy[];
  count?: boolean;
}
