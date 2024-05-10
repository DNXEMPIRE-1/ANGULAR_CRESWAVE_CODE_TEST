import { AddMap } from 'mapper-ts/lib-esm';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { TableItemConfig } from '../configs';
import { TableItem } from '../types';
import { ProfilePresetTaskItem } from './profile-preset-task-item';
import { ProfileType } from './profile-type';

export class Profile implements TableItem {
  id?: number;
  name?: string;
  timeTarget?: string;
  tasksTarget?: number;
  priority?: number;
  userId?: number;
  profileTypeId?: number;
  @AddMap(ProfileType)
  profileType?: ProfileType;
  @AddMap(ProfilePresetTaskItem)
  profilePresetTaskItems?: ProfilePresetTaskItem[];

  static tableItems = (): TableItemConfig<Profile>[] => [
    { header: '#', key: 'id', hiddenInLowRes: true },
    { header: 'Name', key: 'name' },
    { header: 'Type', key: ['profileType', 'name'], hiddenInLowRes: true },
    { header: 'Time', key: 'timeTarget', pipe: TimePipe },
    { header: 'Priority', key: 'priority', hiddenInLowRes: true },
  ];
}

export interface ProfileIdsStore {
  byDate: Record<string, number | undefined>;
  dates: string[];
}

export interface ActiveProfileIds {
  weekday: number | null;
  weekend: number | null;
  holiday: number | null;
  customDateRanges: ProfileDateRange[];
}

export interface ProfileDateRange {
  profileId: number;
  start: Date;
  end: Date;
  priority: number;
}
