import { Icons } from 'src/app/util';

export interface Crumb {
  label: string;
  url: string;
  params?: Record<string, string>;
  icon?: Icons;
}
