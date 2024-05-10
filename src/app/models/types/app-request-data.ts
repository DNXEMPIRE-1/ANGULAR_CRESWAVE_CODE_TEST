import { Loading } from '../configs';

export interface AppRequestData extends RequestData {
  moment: number;
  url: string;
}

export interface RequestData {
  loadings?: Loading[];
}
