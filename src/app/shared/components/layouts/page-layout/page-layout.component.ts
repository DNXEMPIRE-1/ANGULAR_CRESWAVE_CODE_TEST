import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-page-layout',
  template: `<app-sidebar>
    <div class="container">
      <ng-content></ng-content>
    </div>
  </app-sidebar>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SidebarComponent],
})
export class PageLayoutComponent {}
