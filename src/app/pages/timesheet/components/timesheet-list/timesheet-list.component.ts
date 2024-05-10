import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TableConfig, Timesheet, WithDestroyed } from 'src/app/models';
import { PaginationOptions } from 'src/app/models/configs/pagination-options';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { AppService, FilterService, ModalService } from 'src/app/services';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { ElementIds, QueryUtil, deleteModalData, paths } from 'src/app/util';
import { TimesheetService } from '../../services/timesheet.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TableComponent, PaginationComponent, AsyncPipe],
})
export class TimesheetListComponent extends WithDestroyed {
  private app = inject(AppService);
  private service = inject(TimesheetService);
  private profileService = inject(ProfileService);
  private toaster = inject(ToastService);
  private modalService = inject(ModalService);
  private filterService = inject(FilterService);

  listItems$ = this.service.listItems$;
  total$ = this.service.total$;
  lastOptions$ = this.service.lastOptions$;
  profiles$ = this.profileService.listItems$;

  config: TableConfig<Timesheet> = {
    itemConfigs: Timesheet.tableItems(),
    orderBy: { key: 'id', direction: 'asc' },
    itemType: Timesheet,
    detailsUrl: paths.timesheetsDetails,
    hasCopy: true,
    hasDelete: true,
    hasEdit: true,
    hasView: true,
  };

  elIds = ElementIds;

  onFilter(): void {
    this.filterService.filterDebounced(this.loadItems.bind(this));
  }

  applyFilter(): void {
    this.filterService.cancelPreviousCall();
    this.loadItems();
  }

  async loadItems(): Promise<void> {
    await this.service.loadListItems(this.getPaginationQuery(1));
  }

  async paginate(event: PageEvent): Promise<void> {
    if (event == null) {
      this.toaster.error('Error while paginating');
      return;
    }

    const { pageIndex, pageSize } = event;
    this.service.loadListItems(this.getPaginationQuery(pageIndex + 1, pageSize));
  }

  private deleteItem = async (id: number) => {
    await this.service.deleteItem(id);
    this.service.goToList();
  };

  private getPaginationQuery(page: number, itemsPerPage?: number): PaginationOptions {
    const { start, end } = this.app.getDateRangeOrDefault();

    return PaginationOptions.from(page, itemsPerPage ?? this.service.getItemsPerPage(), {
      orderBy: QueryUtil.orderByToOData(this.config.orderBy),
      filter: {
        ...QueryUtil.getDateRangeFilter('date', start, end),
      },
    });
  }

  openDeleteModal(id: number): void {
    this.modalService.confirmation(deleteModalData(), () => this.deleteItem(id));
  }

  handleOrderBy(): void {
    this.service.loadListItems(this.getPaginationQuery(1));
  }
}
