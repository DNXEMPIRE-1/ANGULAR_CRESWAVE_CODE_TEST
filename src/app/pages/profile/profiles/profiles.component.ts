import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { paths } from 'src/app/util';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/components/buttons';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { TitleComponent } from 'src/app/shared/components/title/title.component';
import { ProfileListComponent } from '../components/profile-list/profile-list.component';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageLayoutComponent,
    TitleComponent,
    ButtonComponent,
    ProfileListComponent,
    RouterOutlet,
  ],
})
export class ProfilesComponent implements OnInit {
  paths = paths;

  constructor(private service: ProfileService) {}

  ngOnInit(): void {
    this.service.loadListData();
  }

  goToCreate() {
    this.service.goToCreate();
  }
}
