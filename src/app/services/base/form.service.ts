import { inject } from '@angular/core';
import { BehaviorSubject, Observable, filter, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Nullish, PaginationOptions, PostReturn, TableItem } from 'src/app/models';
import { Constants } from 'src/app/util';
import { FormApiService } from '../interfaces/form-api-service';
import { ToastService } from '../toast.service';

export abstract class FormService<TEntity extends TableItem> {
  protected toaster = inject(ToastService);

  protected _item$ = new BehaviorSubject<TEntity | undefined>(undefined);
  protected _listItems$ = new BehaviorSubject<TEntity[]>([]);
  protected _total$ = new BehaviorSubject(0);
  protected _lastOptions$ = new BehaviorSubject<PaginationOptions>(PaginationOptions.default());

  get item$(): Observable<TEntity | undefined> {
    return this._item$.asObservable();
  }

  get listItems$(): Observable<TEntity[]> {
    return this._listItems$.asObservable();
  }

  get total$(): Observable<number> {
    return this._total$.asObservable();
  }

  get lastOptions$(): Observable<PaginationOptions> {
    return this._lastOptions$.asObservable();
  }

  protected toastMessages = {
    noId: "Couldn't fetch ID!",
    noItem: "Couldn't fetch item!",
    reloadError: "Couldn't reload item!",
    createSuccess: 'Item created successfully!',
    updateSuccess: 'Item updated successfully!',
    updateIdError: "Couldn't update item, couldn't fetch ID!",
    deleteSuccess: 'Item deleted successfully!',
    duplicateSuccess: 'Item duplicated successfully!',
  };

  constructor(protected api: FormApiService<TEntity>) {}

  async loadListItems(options?: PaginationOptions): Promise<void> {
    if (options == null) {
      options = this._lastOptions$.getValue() ?? PaginationOptions.default();
    } else {
      this.setLastOptions(options);
    }

    const res = await this.api.getPaginated(options);

    this.setListItems(res.items);
    this.setTotal(res.total);
  }

  async loadItem(id: number | string | Nullish): Promise<TEntity | null> {
    if (!id) {
      this.toaster.error(this.toastMessages.noId);

      return null;
    }

    const parsedId = +id;
    const item = this._item$.getValue();

    if (item?.id === parsedId) return item;

    const res = await this.api.getById(parsedId);

    this.setItem(res);

    if (res == null) this.toaster.error(this.toastMessages.noItem);

    return res;
  }

  update = async (id: string | Nullish, item: Partial<TEntity>): Promise<void> => {
    if (id == null) {
      this.toaster.error(this.toastMessages.updateIdError);
      return;
    }

    await this.api.update({ ...item, id: +id });

    this.toaster.success(this.toastMessages.updateSuccess);

    this.reloadItem(id);
    await this.loadListItems();
  };

  private reloadItem = async (id: string | Nullish): Promise<void> => {
    if (!id) return;

    try {
      const item = await this.api.getById(+id);
      this.setItem(item);
    } catch (error) {
      this.toaster.error(this.toastMessages.reloadError);
    }
  };

  itemByIdFromCache$ = (id: number | string | Nullish): Observable<TEntity | null> => {
    if (typeof id !== 'number') return of(null);

    return this.listItems$.pipe(
      switchMap((items) => items),
      filter((x) => x.id === +id)
    );
  };

  insert = async (item: Partial<TEntity>): Promise<PostReturn> => {
    const res = await this.api.insert(item);

    this.toaster.success(this.toastMessages.createSuccess);

    await this.loadListItems();

    return res;
  };

  duplicate = async (item: Partial<TEntity>): Promise<PostReturn> => {
    if (this.api.duplicate == null) throw new Error('Api Service Duplicate is not implemented!');

    const res = await this.api.duplicate(item);

    this.toaster.success(this.toastMessages.duplicateSuccess);

    await this.loadListItems();

    return res;
  };

  deleteItem = async (id: string | number | Nullish): Promise<void> => {
    if (!id) {
      this.toaster.error(this.toastMessages.noId);

      return;
    }
    const parsedId = +id;

    await this.api.remove(parsedId);
    this.removeFromMemory(parsedId);

    this.toaster.success(this.toastMessages.deleteSuccess);
  };

  getItemsPerPage = (): number => {
    return this._lastOptions$.getValue()?.itemsPerPage ?? Constants.DefaultItemsPerPage;
  };

  protected setListItems(items: TEntity[]): void {
    this._listItems$.next(items);
  }

  protected setItem(item: TEntity | undefined): void {
    this._item$.next(item);
  }

  protected setTotal(total: number): void {
    this._total$.next(total);
  }

  protected setLastOptions(options: PaginationOptions): void {
    this._lastOptions$.next(options);
  }

  protected removeFromMemory = (id: number): void => {
    const item = this._item$.getValue();
    if (item?.id === id) this.setItem(undefined);

    const listItems = this._listItems$.getValue();

    if (!listItems.some((x) => x.id === id)) return;

    const filteredListItems = listItems.filter((x) => x.id !== id);
    this.setListItems(filteredListItems);
    this.setTotal(this._total$.getValue() - 1);

    if (filteredListItems.length === 0) {
      this.decrementPage();

      this.loadListItems();
    }
  };

  protected decrementPage = (): void => {
    const lastOptions = this._lastOptions$.getValue();
    if (!lastOptions?.page) return;

    this.setLastOptions({ ...lastOptions, page: lastOptions.page - 1 });
  };
}
