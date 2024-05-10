import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavItemsComponent } from '../nav-items/nav-items.component';
import { defaultNavItems } from 'src/app/util';

@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [CommonModule, NavItemsComponent],
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterNavComponent {
  @Input() showNav = true;
  navItems = defaultNavItems;
}
