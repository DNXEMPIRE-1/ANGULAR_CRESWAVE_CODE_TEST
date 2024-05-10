import { Injectable, OnDestroy } from '@angular/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, map, takeUntil, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  TimesheetAverageMetrics,
  Nullish,
  PaginationOptions,
  Timesheet,
  TimesheetMetrics,
  TimesheetMetricsDto,
  TimesheetMetricsStore,
} from '../../../models';
import {
  DateUtil,
  DetailsTypes,
  PubSubUtil,
  QueryUtil,
  StringUtil,
  TimesheetUtil,
  paths,
} from '../../../util';
import { AppService } from '../../../services/app.service';
import { FormService } from '../../../services/base/form.service';
import {
  TimesheetFormGroup,
  TimesheetFormValue,
} from '../components/timesheet-form/timesheet-form-group';
import { TimesheetApiService } from './timesheet-api.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService extends FormService<Timesheet> implements OnDestroy {
  private readonly initialMetricsStore = {
    byDate: {},
    dates: [],
  };

  private _metricsStore$ = new BehaviorSubject<TimesheetMetricsStore>(this.initialMetricsStore);
  private destroyed$ = new Subject<boolean>();

  override get listItems$() {
    return this._listItems$.asObservable();
  }

  get metricsStore$() {
    return this._metricsStore$.asObservable();
  }

  get metricsList$() {
    return this.metricsStore$.pipe(
      map((metricsStore) => {
        const { byDate } = metricsStore;

        return Object.values(byDate);
      })
    );
  }

  get avgMetrics$(): Observable<TimesheetAverageMetrics | null> {
    return this.metricsList$.pipe(
      map((metricsList) => {
        if (!metricsList.length) return null;

        let totalTasks = 0;
        let workedHours = 0;
        let averageRating = 0;
        const total = metricsList.length;

        for (const metrics of metricsList) {
          if (metrics == null) continue;

          totalTasks += metrics.totalTasks ?? 0;
          workedHours += metrics.workedHours ?? 0;
          averageRating += metrics.averageRating ?? 0;
        }
        const dayAvgs = {
          totalTasks: totalTasks / total,
          workedHours: workedHours / total,
          averageRating: averageRating / total,
        };

        const result: TimesheetAverageMetrics = {
          total,
          totalTasks,
          workedHours,
          averageRating,
          dayAvgs,
          weekAvgs: {
            totalTasks: dayAvgs.totalTasks * 7,
            workedHours: dayAvgs.workedHours * 7,
            averageRating: dayAvgs.averageRating * 7,
          },
        };

        return result;
      })
    );
  }

  get unavailableDates$() {
    return this.metricsStore$.pipe(
      map((metricsStore) => metricsStore.dates.map(DateUtil.dateStringToDate))
    );
  }
  get dateFilterFn$(): Observable<DateFilterFn<Date | Nullish>> {
    return this.unavailableDates$.pipe(
      map((unavailableDates) => {
        return (date) => {
          if (!date) return false;

          return !DateUtil.isDateInDates(date, unavailableDates);
        };
      })
    );
  }

  constructor(
    protected override api: TimesheetApiService,
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

  private initSubs(): void {
    this.app.clearSessionState$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this._item$.next(undefined);
      this._listItems$.next([]);
      this._metricsStore$.next(this.initialMetricsStore);
    });

    this.item$
      .pipe(
        takeUntil(this.destroyed$),
        filter((item): item is Timesheet => item != null),
        tap((item) => {
          const { id, date } = item;

          if (id) this.reloadMetricsById(id);
          if (date) this.app.setActiveDate(date);
        })
      )
      .subscribe();
    this.app.dateRange$
      .pipe(
        takeUntil(this.destroyed$),
        tap((dateRange) => {
          if (dateRange == null) return;

          const { start, end } = dateRange;

          this.loadListDataByRange(start, end);
        })
      )
      .subscribe();
    this.metricsStore$
      .pipe(
        takeUntil(this.destroyed$),
        tap((metricsStore) => {
          this.setTimesheetsMetrics(metricsStore);
        })
      )
      .subscribe();
  }

  private async loadListItemsByRange(from: Date, to: Date): Promise<void> {
    const options = PaginationOptions.fromOptions({
      filter: {
        ...QueryUtil.getDateRangeFilter('date', from, to),
      },
    });
    this.loadListItems(options);
  }

  async loadItemByDate(date: Date): Promise<Timesheet> {
    const item = this._item$.getValue();
    const itemDate = item?.date;

    if (!!itemDate && DateUtil.dateStringToDate(itemDate) === date) {
      return item;
    }

    const res = await this.api.getByDate(date);

    this._item$.next(res);

    return res;
  }

  private async loadMetricsByRange(from: Date, to: Date): Promise<void> {
    const metricsList = await this.getMetricsByRange(from, to);

    this.setMetricsStore(metricsList);
  }

  private setTimesheetsMetrics(metricsStore: TimesheetMetricsStore): void {
    const newItems = this._listItems$.getValue().map((item): Timesheet => {
      const date = item?.date;
      if (!date) return item;

      return {
        ...item,
        metrics: TimesheetUtil.mapMetricsToDto(metricsStore.byDate[date]),
      };
    });

    this._listItems$.next(newItems);
  }

  async reloadMetricsById(id: number) {
    const metrics = await this.getMetricsById(id);

    this.addMetrics(metrics);
  }

  private getMetricsByRange = async (
    from: Date,
    to: Date
  ): Promise<TimesheetMetricsDto[]> | never => {
    const metrics = await this.api
      .getMetricsQuery({
        filter: {
          ...QueryUtil.getDateRangeFilter('date', from, to),
        },
      })
      .catch((err) => {
        this.toaster.error('Error loading timesheet metrics!');
        throw err;
      });

    return metrics;
  };

  private getMetricsById = async (id: number): Promise<TimesheetMetricsDto> | never => {
    const metrics = await this.api
      .getMetricsQuery({
        filter: {
          id,
        },
      })
      .catch((err) => {
        this.toaster.error('Error reloading timesheet metrics!');
        throw err;
      });

    return metrics[0];
  };

  /**
   * @description Normalizing the metrics list state shape to a data table with date keys
   */
  private setMetricsStore(metricsList: TimesheetMetricsDto[]): void {
    const metricsStore: TimesheetMetricsStore = { byDate: {}, dates: [] };

    metricsList
      .filter((metrics): metrics is Required<TimesheetMetricsDto> => metrics?.date != null)
      .forEach((metrics) => {
        const date = DateUtil.dateTimeStringToDateString(metrics.date);

        if (!date) return;

        metricsStore.byDate[date] = TimesheetUtil.mapMetrics(metrics);
        metricsStore.dates.push(date);
      });

    this._metricsStore$.next(metricsStore);
  }

  private addMetrics(metrics: TimesheetMetricsDto): void {
    const metricsStore = this._metricsStore$.getValue();
    const date = DateUtil.dateTimeStringToDateString(metrics.date);

    if (!date) return;

    metricsStore.byDate[date] =
      metrics != null
        ? TimesheetUtil.mapMetrics(metrics as Required<TimesheetMetricsDto>)
        : undefined;
    metricsStore.dates.push(date);

    this._metricsStore$.next(metricsStore);
  }

  override setListItems(items: Timesheet[]): void {
    const metricsStore = this._metricsStore$.getValue();
    const newItems = items
      .filter((item): item is Required<Timesheet> => item?.date != null)
      .map((timesheet) => {
        const { date } = timesheet;
        const dateString = DateUtil.dateTimeStringToDateString(date);
        return {
          ...timesheet,
          date: dateString,
          metrics: TimesheetUtil.mapMetricsToDto(metricsStore.byDate[dateString]),
        };
      });

    this._listItems$.next(newItems);
  }

  goToCreateOrDetailsBasedOnDate = async (date: Date): Promise<boolean> => {
    const existingItem = await this.api.getQuery({ filter: { date: date } });

    const item = existingItem?.[0];

    if (item?.id == null) return this.goToCreate(date);

    this._item$.next(item);

    return this.goToDetails(item.id, DetailsTypes.Edit);
  };

  loadListData = async (): Promise<void> => {
    const hasInit = this.app.initDateRange();
    if (hasInit) return;

    const { start, end } = this.app.getDateRangeOrDefault();
    this.loadListDataByRange(start, end);
  };

  loadListDataByRange = async (from: Date, to: Date): Promise<void> => {
    this.loadMetricsByRange(from, to);
    this.loadListItemsByRange(from, to);
  };

  loadEditData = async (id: string | null | undefined): Promise<Timesheet | null> => {
    return this.loadItem(id);
  };

  convertToFormValue(item: Timesheet): Partial<TimesheetFormValue> {
    const value: Partial<TimesheetFormValue> = {
      ...item,
      date: new Date(item.date ?? ''),
      notes: [],
      tasks: [],
    };

    if (item?.notes) {
      value.notes = item.notes;
    }
    if (item?.tasks) {
      value.tasks = item.tasks.map((x) => ({
        ...x,
        time: StringUtil.numberToTime(x.time as unknown as number),
      }));
    }

    return value;
  }

  toJson(fg: TimesheetFormGroup): Partial<Timesheet> {
    return TimesheetFormGroup.toJson(fg);
  }

  private setToastMessages(): void {
    this.toastMessages = {
      ...this.toastMessages,
      noItem: "Couldn't fetch timesheet!",
      createSuccess: 'Timesheet created successfully!',
      updateSuccess: 'Timesheet updated successfully!',
      updateIdError: "Couldn't update timesheet, couldn't fetch ID!",
      deleteSuccess: 'Timesheet deleted successfully!',
      duplicateSuccess: 'Timesheet duplicated successfully!',
    };
  }

  /**
   * @description Builds an observable stream from a given date in 'yyyy-MM-dd' format
   */
  metricsByDate$(date: string): Observable<TimesheetMetrics> {
    return this.metricsStore$.pipe(
      map((store) => store.byDate[date]),
      filter((metrics): metrics is TimesheetMetrics => metrics != null)
    );
  }

  async handleSlideMenuClick(dateString: string, type: DetailsTypes) {
    const items = this._listItems$.getValue();

    let item: Timesheet | Nullish = items.find((x) => x.date === dateString);
    if (item?.id == null) {
      const newDate = DateUtil.dateStringToDate(dateString);
      item = await this.findTimesheetToNavigate(newDate);
      if (item?.id == null) {
        this.goToCreate(newDate);

        return;
      }
    }
    this.goToDetails(item.id, type);
  }

  private findTimesheetToNavigate = async (date: Date): Promise<Timesheet | null> => {
    const item = await this.api.getByDate(date).catch((err) => {
      this.toaster.error('Error loading timesheet!');
      throw err;
    });
    if (item?.id == null) {
      this.toaster.warning(`Timesheet of date ${date} not found!`);
      return null;
    }
    return item;
  };

  goToList = () => this.router.navigateByUrl(paths.timesheets);
  goToCreate = (date?: Date) =>
    this.router.navigate([paths.timesheetsCreate], {
      queryParams: { date: DateUtil.formatDateToUniversalFormat(date ?? new Date()) },
    });
  goToDetails = async (id: number, type: DetailsTypes) =>
    this.router.navigate([paths.timesheetsDetails], { queryParams: { id, type } });
}
