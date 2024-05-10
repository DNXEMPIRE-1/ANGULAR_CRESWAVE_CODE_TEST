import { Injectable } from '@angular/core';
import {
  PresetTaskItem,
  ApiRequest,
  PaginationOptions,
  PaginatedResult,
  PostReturn,
  PresetTaskItemPostDto,
  RequestData,
} from 'src/app/models';
import { PresetTaskItemPutDto } from 'src/app/models/dtos/task-item/preset-task-item-put-dto';
import { LoadingService } from 'src/app/services';
import { ApiService } from 'src/app/services/api/api.service';
import { FormApiService } from 'src/app/services/interfaces';
import { QueryUtil, ApiEndpoints, ElementIds } from 'src/app/util';

@Injectable({
  providedIn: 'root',
})
export class PresetTaskItemApiService implements FormApiService<PresetTaskItem> {
  private url = QueryUtil.buildApiUrl(ApiEndpoints.PresetTaskItems);

  constructor(private api: ApiService) {}

  async getItems(customData?: RequestData): Promise<PresetTaskItem[]> {
    return this.api.getOData<PresetTaskItem>({
      ...ApiRequest.get<PresetTaskItem>(this.url, PresetTaskItem),
      customData,
    });
  }

  async getById(id: number): Promise<PresetTaskItem> {
    const res = await this.api.getById<PresetTaskItem>({
      ...ApiRequest.getById<PresetTaskItem>(this.url, PresetTaskItem, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.PresetTaskItemForm) },
    });

    return res;
  }

  async getPaginated(options: PaginationOptions): Promise<PaginatedResult<PresetTaskItem>> {
    const queryUrl = QueryUtil.buildPaginatedODataQuery(this.url, options);

    const res = await this.api.getPaginated<PresetTaskItem>({
      ...ApiRequest.get<PresetTaskItem>(queryUrl, PresetTaskItem),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.PresetTaskItemTable) },
    });

    return res;
  }

  insert = async (item: PresetTaskItem): Promise<PostReturn> =>
    this.api.insert({
      ...ApiRequest.post(this.url, item, PresetTaskItemPostDto),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.PresetTaskItemSubmit) },
    });

  duplicate = async (item: PresetTaskItem): Promise<PostReturn> => this.insert(item);

  update = async (item: PresetTaskItem): Promise<void> =>
    this.api.update({
      ...ApiRequest.put(this.url, item.id ?? 0, item, PresetTaskItemPutDto),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.PresetTaskItemSubmit) },
    });

  remove = async (id: number): Promise<void> =>
    this.api.remove({
      ...ApiRequest.delete(this.url, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.PresetTaskItemDelete) },
    });
}
