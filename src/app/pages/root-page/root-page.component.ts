import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';

@Component({
  selector: 'app-root-page',
  standalone: true,
  imports: [RouterModule, PageLayoutComponent],
  template: `
    <app-page-layout>
      <router-outlet></router-outlet>
    </app-page-layout>
  `,
  styleUrls: ['./root-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootPageComponent {}
