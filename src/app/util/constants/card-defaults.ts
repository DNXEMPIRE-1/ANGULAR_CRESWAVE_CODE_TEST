import { Card } from 'src/app/models';
import { Pages } from './pages';

const imgConfig = (src: string) => ({
  src,
  priority: true,
  width: 152,
  height: 152,
});

const homeCards: Card[] = [
  {
    id: 'cCardTimesheet',
    title: 'Timesheets',
    content: 'Register your daily tasks and effort hours',
    url: Pages.Timesheets,
    image: imgConfig('/assets/icons/material-edit-calendar.svg'),
  },
  {
    id: 'cCardProfile',
    title: 'Profiles',
    content: 'Manage your productivity profiles',
    url: Pages.Profiles,
    image: imgConfig('/assets/icons/material-favorite.svg'),
  },
  {
    id: 'cCardMetric',
    title: 'Metrics',
    content: 'View your productivity metrics totals and averages',
    url: Pages.Metrics,
    image: imgConfig('/assets/icons/material-bar-chart.svg'),
  },
  {
    id: 'cCardFaq',
    title: 'FAQs',
    content: 'Frequently asked questions & tips on how to best use the app',
    url: Pages.Faqs,
    image: imgConfig('/assets/icons/material-contact-support.svg'),
  },
];

export { homeCards };
