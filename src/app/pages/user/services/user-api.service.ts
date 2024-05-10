import { Injectable } from '@angular/core';

import { ODataOptions } from 'src/app/helpers/odata';
import { ApiRequest, PaginatedResult, PostReturn, Role, User } from 'src/app/models';
import { UserPostDto } from 'src/app/models/dtos/user/user-post-dto';
import { UserPutDto } from 'src/app/models/dtos/user/user-put-dto';
import { FormApiService } from 'src/app/services/interfaces';
import { ApiEndpoints, ElementIds, QueryUtil } from 'src/app/util';
import { PaginationOptions } from '../../../models/configs/pagination-options';
import { ApiService } from '../../../services/api/api.service';
import { LoadingService } from '../../../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class UserApiService implements FormApiService<User> {
  private url = QueryUtil.buildApiUrl(ApiEndpoints.Users);
  private rolesUrl = QueryUtil.buildApiUrl(ApiEndpoints.Roles);

  constructor(private api: ApiService) {}

  async getQuery(options: ODataOptions): Promise<User[]> {
    const queryUrl = QueryUtil.buildODataQuery(this.url, options);

    const res = await this.api.get<User>({
      ...ApiRequest.get<User>(queryUrl, User),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.UserForm) },
    });

    return res;
  }

  async getById(id: number): Promise<User> {
    const res = await this.api.getById<User>({
      ...ApiRequest.getById<User>(this.url, User, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.UserForm) },
    });

    return res;
  }

  async getByEmail(email: string): Promise<User> {
    const queryUrl = QueryUtil.buildODataQuery(this.url, {
      filter: { email },
    });

    return this.api.get<User>({
      ...ApiRequest.get<User>(queryUrl, User),
      mapFn: (res: User[]) => res?.[0],
      customData: {
        loadings: LoadingService.createManyFromIds([ElementIds.UserForm, ElementIds.HeaderUser]),
      },
    }) as Promise<User>;
  }

  async getPaginated(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const queryUrl = QueryUtil.buildPaginatedODataQuery(this.url, options);

    const res = await this.api.getPaginated<User>({
      ...ApiRequest.get<User>(queryUrl, User),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.UserTable) },
    });

    return res;
  }

  async getRoles(): Promise<Role[]> {
    return this.api.getOData<Role>({
      ...ApiRequest.get<Role>(this.rolesUrl, Role),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.UserFormRoles) },
    });
  }

  insert = async (item: User): Promise<PostReturn> =>
    this.api.insert({
      ...ApiRequest.post(this.url, item, UserPostDto),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.UserSubmit) },
    });

  update = async (item: Partial<User>): Promise<void> =>
    this.api.update({
      ...ApiRequest.put(this.url, item.id ?? 0, item, UserPutDto),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.UserSubmit) },
    });

  remove = async (id: number): Promise<void> =>
    this.api.remove({
      ...ApiRequest.delete(this.url, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.UserDelete) },
    });
}
