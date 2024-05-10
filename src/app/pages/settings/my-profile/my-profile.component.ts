import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { UserAuthGet } from 'src/app/models';
import { AuthService } from 'src/app/services';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { FormTypes, PubSubUtil } from 'src/app/util';
import { TitleComponent } from '../../../shared/components/title/title.component';
import {
  getMyProfileForm,
  MyProfileFormGroup,
} from '../components/my-profile-form/my-profile-form-group';
import { MyProfileFormComponent } from '../components/my-profile-form/my-profile-form.component';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PageLayoutComponent, MyProfileFormComponent, TitleComponent],
})
export class MyProfileComponent implements OnInit, OnDestroy {
  private service = inject(SettingsService);
  private authService = inject(AuthService);
  private destroyed$ = new Subject<boolean>();

  loggedUser$ = this.authService.loggedUser$;

  form!: MyProfileFormGroup;

  FormTypes = FormTypes;

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.runInitMethods();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  runInitMethods(): void {
    this.initForm();
    this.initSubs();
  }

  initSubs(): void {
    this.loggedUser$.pipe(takeUntil(this.destroyed$)).subscribe((user) => {
      this.initForm(user ?? undefined);
    });
  }

  initForm(loggedUser?: UserAuthGet): void {
    if (this.form == null) {
      this.form = MyProfileFormGroup.from(getMyProfileForm());
    }
    this.form.patchValue(loggedUser ?? {});
  }

  submitForm(): Promise<void> {
    return this.editItem();
  }

  async editItem(): Promise<void> {
    const value = MyProfileFormGroup.toJson(this.form);
    return this.service.updateMyProfile(value);
  }

  onCancel(): Promise<boolean> {
    return this.service.goToIndex();
  }
}
