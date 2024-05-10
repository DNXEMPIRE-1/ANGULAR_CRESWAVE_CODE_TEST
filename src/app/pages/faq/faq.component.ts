import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollapsibleComponent } from 'src/app/shared/components/collapsible/collapsible.component';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { LinkComponent } from 'src/app/shared/components/link/link.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { Icons, paths } from 'src/app/util';
import { TimesheetSlideSpanComponent } from '../timesheet/components/timesheet-slide-span/timesheet-slide-span.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    TimesheetSlideSpanComponent,
    IconComponent,
    TitleComponent,
    CollapsibleComponent,
    LinkComponent,
  ],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  paths = paths;
  Icons = Icons;
}
