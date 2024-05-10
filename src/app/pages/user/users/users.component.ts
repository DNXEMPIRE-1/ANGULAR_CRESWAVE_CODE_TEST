import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { paths } from 'src/app/util';
import { UserService } from '../services/user.service';
import { UserListComponent } from '../components/user-list/user-list.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageLayoutComponent, TitleComponent, ButtonComponent, UserListComponent, RouterOutlet],
})
export class UsersComponent implements OnInit {
  paths = paths;

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.service.loadListData();
  }

  goToCreate() {
    this.service.goToCreate();
  }
}
