import { NavItem } from 'src/app/models';
import { Pages, paths } from './pages';
import { Icons } from './icons.enum';
import { UserRoles } from './user-roles.enum';

export const defaultNavItems: NavItem[] = [
  {
    id: 'Timesheets',
    label: 'Timesheets',
    link: Pages.Timesheets,
    icon: Icons.CalendarToday,
  },
  {
    id: 'Profiles',
    label: 'Profiles',
    link: Pages.Profiles,
    icon: Icons.Favorite,
  },
  {
    id: 'Tasks',
    label: 'Preset Tasks',
    link: paths.presetTaskItems,
    icon: Icons.Assignment,
  },
  {
    id: 'Metrics',
    label: 'Metrics',
    link: Pages.Metrics,
    icon: Icons.BarChart,
  },
  {
    id: 'Faq',
    label: 'FAQs',
    link: Pages.Faqs,
    icon: Icons.ContactSupport,
  },
  {
    id: 'Users',
    label: 'Users',
    link: Pages.Users,
    icon: Icons.Group,
    roles: [UserRoles.Admin],
  },
];

export const userNavItems: NavItem[] = [];
