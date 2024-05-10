import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { PaginationOptions, Role, User } from 'src/app/models';
import { AppService } from 'src/app/services';
import { FormService } from 'src/app/services/base/form.service';
import { PubSubUtil } from 'src/app/util';
import { DetailsTypes, paths } from 'src/app/util/constants/pages';
import { UserFormValue } from '../components/user-form/user-form-group';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends FormService<User> implements OnDestroy {
  private destroyed$ = new Subject<boolean>();
  private _roles$ = new BehaviorSubject<Role[]>([]);

  get roles$() {
    return this._roles$.asObservable();
  }

  roleOptions$ = this.roles$.pipe(
    map((roles) => {
      return roles
        .filter((role): role is Required<Role> => !!role.id && !!role.name)
        .map(({ id, name }, index) => ({ value: id ?? index, label: name }));
    }),
    distinctUntilChanged()
  );

  constructor(
    protected override api: UserApiService,
    private app: AppService,
    private router: Router
  ) {
    super(api);
    this.setToastMessages();
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  private initSubs() {
    this.app.clearSessionState$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this._item$.next(undefined);
      this._listItems$.next([]);
      this._roles$.next([]);
    });
  }

  loadListData = async (): Promise<void> => {
    await this.loadListItems(PaginationOptions.default());
  };

  loadCreateData = async () => {
    await this.loadRoles();
  };

  loadEditData = async (id: string | null | undefined): Promise<User | null> => {
    await this.loadRoles();
    return this.loadItem(id);
  };

  loadRoles = async () => {
    const roles = await this.api.getRoles();
    this._roles$.next(roles);
  };

  convertToFormValue(item: User): Partial<UserFormValue> {
    const userRoles = item.userRoles ?? [];
    const value: Partial<UserFormValue> = {
      name: item.name,
      userName: item.userName,
      email: item.email,
      roleIds: userRoles.map((x) => x.roleId).filter((id): id is number => id != null),
    };

    return value;
  }

  goToList = () => this.router.navigateByUrl(paths.users);
  goToCreate = () => this.router.navigateByUrl(paths.usersCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.usersDetails], { queryParams: { id, type } });
  };

  private setToastMessages = () => {
    this.toastMessages = {
      ...this.toastMessages,
      noItem: "Couldn't fetch user!",
      createSuccess: 'User created successfully!',
      updateSuccess: 'User updated successfully!',
      updateIdError: "Couldn't update user, couldn't fetch ID!",
      deleteSuccess: 'User deleted successfully!',
    };
  };
}
