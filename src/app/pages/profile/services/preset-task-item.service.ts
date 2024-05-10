import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, map, takeUntil } from 'rxjs';
import { PaginationOptions, PresetTaskItem, SelectOption } from 'src/app/models';
import { TimePipe } from 'src/app/pipes';
import { AppService, LoadingService } from 'src/app/services';
import { FormService } from 'src/app/services/base/form.service';
import { ArrayUtil, DetailsTypes, ElementIds, PubSubUtil, paths } from 'src/app/util';
import {
  PresetTaskItemFormGroup,
  PresetTaskItemFormValue,
} from '../components/preset-task-item-form/preset-task-item-form-group';
import { PresetTaskItemApiService } from './preset-task-item-api.service';

@Injectable({
  providedIn: 'root',
})
export class PresetTaskItemService extends FormService<PresetTaskItem> implements OnDestroy {
  private destroyed$ = new Subject<boolean>();
  private _tasks$ = new BehaviorSubject<PresetTaskItem[]>([]);

  get tasks$() {
    return this._tasks$.asObservable();
  }

  taskOptions$ = this.tasks$.pipe(map((tasks) => PresetTaskItemService.toOptions(tasks)));

  constructor(
    protected override api: PresetTaskItemApiService,
    private app: AppService,
    private router: Router
  ) {
    super(api);
    this.setToastMessages();
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  private initSubs() {
    this.app.clearSessionState$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this._item$.next(undefined);
      this._listItems$.next([]);
    });

    this.listItems$.pipe(takeUntil(this.destroyed$)).subscribe((items) => {
      const loaded = this._tasks$.getValue();
      const loadedIds = loaded.map((x) => x.id);
      const notAlreadyLoaded = items.filter((x) => !loadedIds.includes(x.id));

      if (ArrayUtil.isEmpty(notAlreadyLoaded)) return;
      this._tasks$.next([...loaded, ...notAlreadyLoaded]);
    });
  }

  loadListData = async (): Promise<void> => {
    await this.loadListItems(PaginationOptions.default());
  };

  loadEditData = async (id: string | null | undefined): Promise<PresetTaskItem | null> => {
    return this.loadItem(id);
  };

  loadTasks = async (): Promise<void> => {
    if (this.hasTasks()) return;

    this.reloadTasks();
  };

  reloadTasks = async (): Promise<void> => {
    const res = await this.api.getItems({
      loadings: LoadingService.createManyFromId(ElementIds.PresetTaskItemFormTasks),
    });

    this._tasks$.next(res);
  };

  hasTasks = () => !ArrayUtil.isEmpty(this._tasks$.getValue());

  convertToFormValue(item: PresetTaskItem): Partial<PresetTaskItemFormValue> {
    return {
      ...item,
      time: TimePipe.formatTimeHhMm(item.time),
    };
  }

  toJson(fg: PresetTaskItemFormGroup): PresetTaskItem {
    return PresetTaskItemFormGroup.toJson(fg);
  }

  goToList = () => this.router.navigateByUrl(paths.presetTaskItems);
  goToCreate = () => this.router.navigateByUrl(paths.presetTaskItemsCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.presetTaskItemsDetails], { queryParams: { id, type } });
  };

  private setToastMessages = () => {
    this.toastMessages = {
      ...this.toastMessages,
      noItem: "Couldn't fetch task!",
      createSuccess: 'Task created successfully!',
      updateSuccess: 'Task updated successfully!',
      updateIdError: "Couldn't update task, couldn't fetch ID!",
      deleteSuccess: 'Task deleted successfully!',
      duplicateSuccess: 'Task duplicated successfully!',
    };
  };

  taskTitleById$ = (id: number | null | undefined) =>
    this.tasks$.pipe(map((tasks) => tasks.find((task) => task.id === id)?.title));

  static toOptions(items: PresetTaskItem[]): SelectOption<number>[] {
    return items
      .filter((item): item is Required<PresetTaskItem> => item.id != null && item.title != null)
      .map(({ id, title }) => ({
        value: id,
        label: title,
      }));
  }
}
