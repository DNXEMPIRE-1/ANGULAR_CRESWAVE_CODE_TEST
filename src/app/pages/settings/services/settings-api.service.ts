import { Injectable } from '@angular/core';

import { ApiRequest } from 'src/app/models';
import { ApiEndpoints, ElementIds, QueryUtil } from 'src/app/util';
import { ApiService } from '../../../services/api/api.service';
import { LoadingService } from '../../../services/loading.service';
import { MyProfileFormValue } from '../components/my-profile-form/my-profile-form-group';

@Injectable({
  providedIn: 'root',
})
export class SettingsApiService {
  private myProfileUrl = QueryUtil.buildApiUrl(ApiEndpoints.MyProfile);

  constructor(private api: ApiService) {}

  updateMyProfile = async (item: MyProfileFormValue & { id: number }): Promise<void> =>
    this.api.patch({
      ...ApiRequest.put(this.myProfileUrl, item.id, item),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.MyProfileSubmit) },
    });
}
