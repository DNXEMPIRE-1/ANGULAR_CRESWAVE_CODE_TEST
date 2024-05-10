import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';
import { paths } from 'src/app/util';
import { MyProfileFormValue } from '../components/my-profile-form/my-profile-form-group';
import { SettingsApiService } from './settings-api.service';
import { ToastService } from 'src/app/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private api = inject(SettingsApiService);

  private authService = inject(AuthService);
  private router = inject(Router);
  private toaster = inject(ToastService);

  async updateMyProfile(item: MyProfileFormValue): Promise<void> {
    const id = Number(this.authService.currentUserId);

    if (!id) {
      this.toaster.error('There was an error while getting your ID!');
      return;
    }

    await this.api.updateMyProfile({ ...item, id: +id });
    await this.authService.refreshLoggedUser();

    this.toaster.success('Your profile was updated successfully!');
  }

  goToIndex() {
    return this.router.navigateByUrl(paths.home);
  }
}
