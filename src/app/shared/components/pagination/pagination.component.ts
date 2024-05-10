import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Constants, PubSubUtil } from 'src/app/util';

@Component({
  selector: 'app-pagination [totalItems] [pageChanged]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatPaginatorModule, CommonModule],
})
export class PaginationComponent {
  @Input() totalItems!: number | null;
  @Input() itemsPerPage: 5 | 10 | 25 | 50 = Constants.DefaultItemsPerPage;
  @Input() color: ThemePalette = 'primary';
  @Input() currentPage = 1;

  @Output() pageChanged = new EventEmitter<PageEvent>();

  isMobile$ = PubSubUtil.isMobile$();

  get total(): number {
    return this.totalItems ?? 0;
  }

  pageSizeOptions = [5, 10, 25, 50];
}
