import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Mapper } from 'mapper-ts/lib-esm';
import { distinctUntilChanged, map, of, share } from 'rxjs';
import {
  IconConfig,
  OrderByConfig,
  TableConfig,
  TableItem,
  TableItemConfig,
  TableKey,
} from 'src/app/models';
import { LoadingService } from 'src/app/services/loading.service';
import { ArrayUtil, DetailsTypes, Icons, ObjectUtil, PubSubUtil, StringUtil } from 'src/app/util';
import { SetIdDirective } from '../../../directives/set-id.directive';
import { DynamicPipe } from '../../../pipes/dynamic.pipe';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { IconButtonComponent } from '../buttons';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-table [items] [config]',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SetIdDirective,
    NgFor,
    NgClass,
    NgIf,
    IconComponent,
    IconButtonComponent,
    MatTooltipModule,
    MatMenuModule,
    LoadingComponent,
    RouterModule,
    AsyncPipe,
    DynamicPipe,
  ],
})
export class TableComponent<T extends TableItem> implements OnInit, OnChanges {
  private loadingService = inject(LoadingService);

  @Input() items!: T[];
  @Input() config!: TableConfig<T>;
  @Input() elId = 'cTableContainer';

  @Output() deleteItem = new EventEmitter<number>();
  @Output() orderByChanged = new EventEmitter<OrderByConfig<T> | null>();

  private _orderedItems: T[] = [];

  isLoading$ = of(false);

  icons: IconConfig<number>[] = [];

  Icons = Icons;

  isSmallScreen$ = PubSubUtil.isInnerWidthLessThan$(1024);

  get hasItems(): boolean {
    return this.orderedItems?.length > 0;
  }

  get itemConfigs(): TableItemConfig<T>[] {
    return this.config.itemConfigs;
  }

  get itemConfigsToRender$() {
    return this.isSmallScreen$.pipe(
      map((isSmallScreen) => {
        if (isSmallScreen) return this.itemConfigs.filter((x) => !x.hiddenInLowRes);

        return this.itemConfigs;
      }),
      distinctUntilChanged(),
      share()
    );
  }

  get orderBy(): OrderByConfig<T> | null {
    return this.config.orderBy;
  }

  get detailsUrl(): string {
    return this.config.detailsUrl;
  }

  get orderedItems(): T[] {
    return this._orderedItems;
  }

  set orderedItems(value: T[]) {
    const itemType = this.config?.itemType;
    if (itemType == null) {
      this._orderedItems = value;
      return;
    }

    this._orderedItems = new Mapper(itemType).map(value) as T[];
  }

  ngOnInit(): void {
    this.initIcons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elId']) {
      this.isLoading$ = this.loadingService.isLoadingById$(this.elId);
    }

    if (changes['items'] || changes['sortColumn'] || changes['sortDirection']) {
      this.orderedItems = this.orderItems(this.items);
    }
  }

  initIcons(): void {
    const { hasCopy, hasDelete, hasEdit, hasView } = this.config;

    const icons = [];
    if (hasCopy) {
      icons.push({
        ...IconConfig.withUrlType('DuplicateIcon', Icons.ContentCopy, DetailsTypes.Duplicate),
        title: 'Duplicate',
      });
    }
    if (hasEdit) {
      icons.push({
        ...IconConfig.withUrlType('EditIcon', Icons.Edit, DetailsTypes.Edit),
        title: 'Edit',
      });
    }
    if (hasView) {
      icons.push({
        ...IconConfig.withUrlType('ViewIcon', Icons.PageView, DetailsTypes.View),
        title: 'View',
      });
    }
    if (hasDelete) {
      icons.push({
        ...IconConfig.withClick(
          'DeleteIcon',
          Icons.Delete,
          (id: number) => this.deleteItem.emit(id),
          'warn'
        ),
        title: 'Delete',
      });
    }

    this.icons = icons;
  }

  canShowActions = () => StringUtil.notEmpty(this.icons);

  getItemId(index: number, item: T): number {
    return item?.id ?? index;
  }

  private getOrderBy(): OrderByConfig<T> | null {
    return this.config.orderBy;
  }

  private setOrderBy(orderBy: OrderByConfig<T> | null): void {
    this.config.orderBy = orderBy == null ? null : { ...orderBy };
    this.orderedItems = this.orderItems(this.items);
    this.orderByChanged.emit(orderBy);
  }

  onOrderBy(columnKey: TableKey<T>): void {
    const newOrderBy = ArrayUtil.onOrderByChange(this.getOrderBy(), columnKey);
    this.setOrderBy(newOrderBy);
  }

  getPropValue(item: T, key: TableKey<T>, defaultsTo: unknown = null): unknown {
    if (!Array.isArray(key)) return item[key];

    return ObjectUtil.getPropValue(item, ObjectUtil.keyToProp(key), defaultsTo);
  }

  orderItems(items: T[]): T[] {
    const orderBy = this.getOrderBy();

    if (!orderBy) return ObjectUtil.deepClone(items);

    return ArrayUtil.orderItems(items, orderBy.key, orderBy.direction);
  }

  buildQueryParams = (id: number | undefined, type: DetailsTypes | undefined) => {
    if (!id || !type) return undefined;

    return {
      id: id.toString(),
      type,
    };
  };
}
