import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ODataOperators } from 'src/app/helpers/odata';
import { PresetTaskItem, TableConfig } from 'src/app/models';
import { PaginationOptions } from 'src/app/models/configs/pagination-options';
import { ToastService } from 'src/app/services/toast.service';
import { FilterService } from 'src/app/services/filter.service';
import { ModalService } from 'src/app/services/modal.service';
import { ElementIds, QueryUtil, deleteModalData, paths } from 'src/app/util';
import { AsyncPipe } from '@angular/common';
import { SearchComponent } from 'src/app/shared/components/inputs/search/search.component';
import { FormLayoutComponent } from 'src/app/shared/components/layouts/form-layout/form-layout.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { PresetTaskItemService } from '../../services/preset-task-item.service';

@Component({
  selector: 'app-preset-task-item-list',
  templateUrl: './preset-task-item-list.component.html',
  styleUrls: ['./preset-task-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormLayoutComponent,
    ReactiveFormsModule,
    SearchComponent,
    TableComponent,
    PaginationComponent,
    AsyncPipe,
  ],
})
export class PresetTaskItemListComponent implements OnInit {
  private service = inject(PresetTaskItemService);
  private toaster = inject(ToastService);
  private modalService = inject(ModalService);
  private filterService = inject(FilterService);

  listItems$ = this.service.listItems$;
  total$ = this.service.total$;
  lastOptions$ = this.service.lastOptions$;

  filterForm!: FormGroup<{
    name: FormControl<string>;
  }>;

  config: TableConfig<PresetTaskItem> = {
    itemConfigs: PresetTaskItem.tableItems(),
    orderBy: { key: 'id', direction: 'asc' },
    detailsUrl: paths.presetTaskItemsDetails,
    hasCopy: true,
    hasDelete: true,
    hasEdit: true,
    hasView: true,
  };

  prevFilter?: string;

  elIds = ElementIds;

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm(): void {
    const form = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(250)] }),
    });

    this.filterForm = form;
  }

  onFilter(): void {
    this.filterService.filterDebounced(this.loadFilteredItems.bind(this));
  }

  applyFilter(): void {
    this.filterService.cancelPreviousCall();
    this.loadFilteredItems();
  }

  async loadFilteredItems(): Promise<void> {
    const { name: nameFilter } = this.filterForm.value;

    if (nameFilter === this.prevFilter) return;
    this.prevFilter = nameFilter;
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
    return PaginationOptions.from(page, itemsPerPage ?? this.service.getItemsPerPage(), {
      filter: { title: this.prevFilter ? [[ODataOperators.Contains, this.prevFilter]] : undefined },
      orderBy: QueryUtil.orderByToOData(this.config.orderBy),
    });
  }

  openDeleteModal(id: number): void {
    this.modalService.confirmation(deleteModalData(), () => this.deleteItem(id));
  }

  handleOrderBy(): void {
    this.service.loadListItems(this.getPaginationQuery(1));
  }
}
