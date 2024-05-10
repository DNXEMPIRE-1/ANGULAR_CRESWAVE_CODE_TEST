import { AddMap, IgnoreMap } from 'mapper-ts/lib-esm';
import { ProfilePresetTaskItemPostDto } from './profile-preset-task-item-post-dto';

@IgnoreMap('id', 'taskIds')
export class ProfilePostDto {
  timeTarget?: number;
  tasksTarget?: number;
  priority?: number;
  profileTypeId?: number;
  @AddMap(ProfilePresetTaskItemPostDto)
  profilePresetTaskItems?: ProfilePresetTaskItemPostDto[];
}
