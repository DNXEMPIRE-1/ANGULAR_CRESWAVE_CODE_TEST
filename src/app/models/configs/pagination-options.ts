import { ODataOptions } from 'src/app/helpers/odata';
import { Constants } from '../../util';

const defaultPage = 1;
const defaultItemsPerPage = Constants.DefaultItemsPerPage;

export class PaginationOptions {
  page?: number;
  itemsPerPage?: number;
  options?: ODataOptions;

  private constructor(page?: number, itemsPerPage?: number, options?: ODataOptions) {
    this.page = page;
    this.itemsPerPage = itemsPerPage;
    this.options = options;
  }

  static default(): PaginationOptions {
    return new PaginationOptions(defaultPage, defaultItemsPerPage);
  }

  static first(itemsPerPage?: number, options?: ODataOptions): PaginationOptions {
    return new PaginationOptions(1, itemsPerPage ?? defaultItemsPerPage, options);
  }

  static from(page: number, itemsPerPage: number, options?: ODataOptions): PaginationOptions {
    return new PaginationOptions(page, itemsPerPage, options);
  }

  static fromOptions(options: ODataOptions): PaginationOptions {
    return {
      ...this.default(),
      options,
    };
  }
}
