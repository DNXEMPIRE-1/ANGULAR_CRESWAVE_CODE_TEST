import { AddMap } from 'mapper-ts/lib-esm';
import { PresetTaskItem } from './preset-task-item';

export class ProfilePresetTaskItem {
  id?: number;
  profileId?: number;
  presetTaskItemId?: number;
  @AddMap(PresetTaskItem)
  presetTaskItem?: PresetTaskItem;
}
