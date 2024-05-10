import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { paths } from 'src/app/util';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { PresetTaskItemListComponent } from '../components/preset-task-item-list/preset-task-item-list.component';
import { PresetTaskItemService } from '../services/preset-task-item.service';

@Component({
  selector: 'app-preset-task-items',
  templateUrl: './preset-task-items.component.html',
  styleUrls: ['./preset-task-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageLayoutComponent,
    TitleComponent,
    ButtonComponent,
    PresetTaskItemListComponent,
    RouterOutlet,
  ],
})
export class PresetTaskItemsComponent implements OnInit {
  private service: PresetTaskItemService = inject(PresetTaskItemService);

  paths = paths;

  ngOnInit(): void {
    this.service.loadListData();
  }

  goToCreate() {
    this.service.goToCreate();
  }
}
