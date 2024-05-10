import { Icons } from 'src/app/util';

export interface NavItem {
  id: string;
  link: string;
  label: string;
  icon: Icons;
  roles?: string[];
}
