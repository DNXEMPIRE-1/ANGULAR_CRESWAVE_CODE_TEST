import { UserAuthGet } from '../user/user-auth-get';

export class AuthResponse {
  user?: UserAuthGet;
  token?: string;
}
