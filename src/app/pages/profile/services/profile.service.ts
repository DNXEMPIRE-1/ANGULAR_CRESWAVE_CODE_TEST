import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';

import { BehaviorSubject, Observable, Subject, from, of } from 'rxjs';
import {
  ActiveProfileIds,
  Nullish,
  PresetTaskItem,
  Profile,
  ProfileIdsStore,
  ProfileType,
} from 'src/app/models';
import { PaginationOptions } from '../../../models/configs/pagination-options';
import { TimePipe } from '../../../pipes';
import { AppService } from '../../../services/app.service';
import { FormService } from '../../../services/base/form.service';
import { LoadingService } from '../../../services/loading.service';
import { ArrayUtil, DetailsTypes, ElementIds, PubSubUtil, paths } from '../../../util';
import { ProfileUtil } from '../../../util/profile.util';
import { ProfileFormGroup } from '../components/profile-form';
import { ProfileFormValue } from '../components/profile-form/profile-form-group';
import { PresetTaskItemService } from './preset-task-item.service';
import { ProfileApiService } from './profile-api.service';
import { ProfileTypeService } from './profile-type.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends FormService<Profile> implements OnDestroy {
  private taskService = inject(PresetTaskItemService);
  private app = inject(AppService);
  private router = inject(Router);
  private profileTypeService = inject(ProfileTypeService);

  private readonly initialActiveProfileIds = {
    weekday: null,
    weekend: null,
    holiday: null,
    customDateRanges: [],
  };

  private destroyed$ = new Subject<boolean>();
  private types$ = new BehaviorSubject<ProfileType[]>([]);

  private _activeProfiles$ = new BehaviorSubject<Profile[]>([]);

  get activeProfiles$() {
    return this._activeProfiles$.asObservable();
  }

  private _activeProfileIds$ = new BehaviorSubject<ActiveProfileIds>(this.initialActiveProfileIds);
  private _profileIdsStore$ = new BehaviorSubject<ProfileIdsStore>(
    ProfileUtil.getInitialProfileIdsStore()
  );

  get profileIdsStore$() {
    return this._profileIdsStore$.asObservable();
  }

  typeOptions$ = this.types$.pipe(map((types) => ProfileTypeService.toOptions(types)));

  constructor(protected override api: ProfileApiService) {
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
      this._activeProfileIds$.next(this.initialActiveProfileIds);
      this._profileIdsStore$.next(ProfileUtil.getInitialProfileIdsStore());
      this._activeProfiles$.next([]);
    });

    this.listItems$.pipe(takeUntil(this.destroyed$)).subscribe((items) => {
      const loadedProfiles = this._activeProfiles$.getValue();
      const loadedProfileIds = loadedProfiles.map((x) => x.id);
      const profilesNotAlreadyLoaded = items.filter((x) => !loadedProfileIds.includes(x.id));

      if (ArrayUtil.isEmpty(profilesNotAlreadyLoaded)) return;
      this._activeProfiles$.next([...loadedProfiles, ...profilesNotAlreadyLoaded]);
    });

    this.activeProfiles$
      .pipe(
        takeUntil(this.destroyed$),
        switchMap((profiles) => {
          this.setActiveProfileIds(profiles);

          return from(this._activeProfileIds$.pipe(takeUntil(this.destroyed$)));
        }),
        tap((activeProfileIds) => {
          this.setProfileIdsStore(activeProfileIds);
        })
      )
      .subscribe();
  }

  loadListData = async (): Promise<void> => {
    await this.loadListItems(PaginationOptions.default());
  };

  loadCreateData = async () => {
    const promises: Promise<void>[] = [];

    promises.push(this.taskService.loadTasks());
    promises.push(this.loadProfileTypes());

    await Promise.all(promises);
  };

  loadEditData = async (id: string | null | undefined): Promise<Profile | null> => {
    await this.loadCreateData();
    return this.loadItem(id);
  };

  loadUserProfiles = async (): Promise<void> => {
    if (this.hasUserProfiles()) return;

    this.reloadUserProfiles();
  };

  reloadUserProfiles = async (): Promise<void> => {
    const res = await this.api.getUserProfiles();

    this._activeProfiles$.next(res);
  };

  hasUserProfiles = (): boolean => {
    const profiles = this._activeProfiles$.getValue();
    return !ArrayUtil.isEmpty(profiles);
  };

  loadProfileTypes = async (): Promise<void> => {
    const res = await this.profileTypeService.getItems({
      loadings: LoadingService.createManyFromId(ElementIds.ProfileFormType),
    });

    this.types$.next(res);
  };

  private setProfileIdsStore = (activeProfileIds: ActiveProfileIds) => {
    const range = this.app.getDateRangeOrDefault();

    const store = ProfileUtil.buildProfileIdsStore(activeProfileIds, range);

    this._profileIdsStore$.next(store);
  };

  convertToFormValue(item: Profile): Partial<ProfileFormValue> {
    const taskIds = item.profilePresetTaskItems
      ?.map((x) => x.presetTaskItemId)
      .filter((id): id is number => !!id);

    return {
      ...item,
      timeTarget: TimePipe.formatTimeHhMm(item.timeTarget),
      taskIds: taskIds ?? [],
    };
  }

  toJson(fg: ProfileFormGroup): Profile {
    return ProfileFormGroup.toJson(fg);
  }

  goToList = () => this.router.navigateByUrl(paths.profiles);
  goToCreate = () => this.router.navigateByUrl(paths.profilesCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.profilesDetails], { queryParams: { id, type } });
  };

  /**
   * @description Builds a stream that gets a profile from a given date in 'yyyy-MM-dd' format
   */
  byDate$(date: string): Observable<Profile | null> {
    return this.profileIdsStore$.pipe(
      map((m) => m.byDate[date]),
      switchMap((id) => this.userProfileByIdFromCache$(id)),
      shareReplay(1)
    );
  }

  tasksByDate$(date: string): Observable<PresetTaskItem[] | null> {
    return this.byDate$(date).pipe(
      map((profile) => {
        const profilePresetTasks = profile?.profilePresetTaskItems ?? [];

        return profilePresetTasks
          .map((x) => x.presetTaskItem)
          .filter((task): task is PresetTaskItem => !!task);
      })
    );
  }

  userProfileByIdFromCache$ = (id: number | string | Nullish): Observable<Profile | null> => {
    if (typeof id !== 'number') return of(null);

    return this.activeProfiles$.pipe(
      switchMap((items) => items),
      filter((x) => x.id === +id)
    );
  };

  private setActiveProfileIds = (profiles: Profile[]) => {
    const baseProfiles = profiles.filter(
      (profile) => !ProfileUtil.isCustomProfile(profile.profileType?.type)
    );
    const customProfiles = profiles.filter((profile) =>
      ProfileUtil.isCustomProfile(profile.profileType?.type)
    );

    const weekdayProfile = ProfileUtil.getActiveWeekdayProfile(baseProfiles);
    const weekendProfile = ProfileUtil.getActiveWeekendProfile(baseProfiles);
    const holidayProfile = ProfileUtil.getActiveHolidayProfile(baseProfiles);
    const customDateRanges = ProfileUtil.getCustomProfileDateRanges(customProfiles);

    this._activeProfileIds$.next({
      weekday: weekdayProfile?.id ?? null,
      weekend: weekendProfile?.id ?? null,
      holiday: holidayProfile?.id ?? null,
      customDateRanges,
    });
  };

  private setToastMessages = () => {
    this.toastMessages = {
      ...this.toastMessages,
      noItem: "Couldn't fetch profile!",
      createSuccess: 'Profile created successfully!',
      updateSuccess: 'Profile updated successfully!',
      updateIdError: "Couldn't update profile, couldn't fetch ID!",
      deleteSuccess: 'Profile deleted successfully!',
      duplicateSuccess: 'Profile duplicated successfully!',
    };
  };
}
