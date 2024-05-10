export enum Pages {
  Home = 'home',
  Timesheets = 'timesheets',
  Profiles = 'profiles',
  PresetTaskItems = 'tasks',
  Settings = 'settings',
  MyProfile = 'my-profile',
  Faqs = 'faqs',
  Users = 'users',
  Metrics = 'metrics',
  NotFound = 'not-found',
  Auth = 'auth',
  Login = 'login',
  Signup = 'signup',
}

export enum PageStates {
  Create = 'create',
  Details = 'details',
}

export enum DetailsTypes {
  View = 'view',
  Edit = 'edit',
  Duplicate = 'duplicate',
}

export const paths = Object.freeze({
  home: `/${Pages.Home}`,
  notFound: `/${Pages.NotFound}`,
  login: `/auth/${Pages.Login}`,
  signup: `/auth/${Pages.Signup}`,
  timesheets: `/${Pages.Timesheets}`,
  timesheetsCreate: `/${Pages.Timesheets}/${PageStates.Create}`,
  timesheetsDetails: `/${Pages.Timesheets}/${PageStates.Details}`,
  profiles: `/${Pages.Profiles}`,
  profilesCreate: `/${Pages.Profiles}/${PageStates.Create}`,
  profilesDetails: `/${Pages.Profiles}/${PageStates.Details}`,
  presetTaskItems: `/${Pages.PresetTaskItems}`,
  presetTaskItemsCreate: `/${Pages.PresetTaskItems}/${PageStates.Create}`,
  presetTaskItemsDetails: `/${Pages.PresetTaskItems}/${PageStates.Details}`,
  users: `/${Pages.Users}`,
  usersCreate: `/${Pages.Users}/${PageStates.Create}`,
  usersDetails: `/${Pages.Users}/${PageStates.Details}`,
  metrics: `/${Pages.Metrics}`,
  myProfile: `/${Pages.Settings}/${Pages.MyProfile}`,
});
