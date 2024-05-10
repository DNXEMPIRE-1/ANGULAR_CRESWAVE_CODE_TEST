import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NavItem } from 'src/app/models';
import { ButtonComponent } from '../buttons/button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-nav-items [items]',
  templateUrl: './nav-items.component.html',
  styleUrls: ['./nav-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
})
export class NavItemsComponent {
  @Input() items!: NavItem[];
  @Input() hiddenLabel = false;
  @Input() iconOnly = false;
  @Input() onSideNav = false;
}
