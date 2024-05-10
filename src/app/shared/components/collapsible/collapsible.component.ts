import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Icons } from './../../../util/constants/icons.enum';

@Component({
  selector: 'app-collapsible',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleComponent {
  @Input() open = false;

  Icons = Icons;
}
