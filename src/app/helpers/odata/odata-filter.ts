import { ODataOperators } from './odata-operators.enum';
import { ODataFilterValue } from './odata-types';

/**
 * @property key - The key of the filter or an array that
 * contains the OData operator and it's value
 *
 * e.g. { name: 'John Doe', age: [['ge', 20], ['le', 30]] }
 * Filters if equal to name and age is between 20 and 30
 */
export interface ODataFilter {
  [key: string]: ODataFilterValue | [ODataOperators, ODataFilterValue][];
}
