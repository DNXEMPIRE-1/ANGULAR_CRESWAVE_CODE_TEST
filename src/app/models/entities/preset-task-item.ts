import { TimePipe } from 'src/app/pipes';
import { TableItemConfig } from '../configs';
import { TableItem } from '../types';

export class PresetTaskItem implements TableItem {
  id?: number;
  title?: string;
  time?: number;
  comment?: string;
  userId?: number;

  static tableItems = (): TableItemConfig<PresetTaskItem>[] => [
    {
      header: 'Title',
      key: 'title',
      styles: {
        minWidth: '240px',
      },
    },
    { header: 'Time', key: 'time', pipe: TimePipe },
  ];
}
