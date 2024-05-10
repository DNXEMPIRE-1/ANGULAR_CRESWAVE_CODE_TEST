import { AddMap, IgnoreMap } from 'mapper-ts/lib-esm';
import { ProfilePresetTaskItemPutDto } from './profile-preset-task-item-put-dto';
import { ProfileTypePutDto } from './profile-type-put-dto';

@IgnoreMap('taskIds')
export class ProfilePutDto {
  id?: number;
  name?: string;
  timeTarget?: number;
  tasksTarget?: number;
  priority?: number;
  profileTypeId?: number;
  @AddMap(ProfileTypePutDto)
  profileType?: ProfileTypePutDto;
  @AddMap(ProfilePresetTaskItemPutDto)
  profilePresetTaskItems?: ProfilePresetTaskItemPutDto[];
}
