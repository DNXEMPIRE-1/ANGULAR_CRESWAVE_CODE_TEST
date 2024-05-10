import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from 'src/app/services';
import { Icons, PubSubUtil } from 'src/app/util';
import { defaultNavItems, paths, userNavItems } from '../../../util/constants';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { MainHeaderComponent } from '../main-header/main-header.component';
import { NavItemsComponent } from '../nav-items/nav-items.component';
import { NavItem } from 'src/app/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatSidenavModule,
    NgIf,
    NavItemsComponent,
    MainHeaderComponent,
    FooterNavComponent,
    RouterModule,
    AsyncPipe,
  ],
})
export class SidebarComponent {
  get navItems(): NavItem[] {
    return defaultNavItems.filter((item) => this.authService.hasRoles(item.roles));
  }

  userNavItems = userNavItems;

  hovering = false;

  Icons = Icons;

  isMobile$ = PubSubUtil.isMobile$();

  paths = paths;

  constructor(private authService: AuthService) {}
}
