import { UserRole } from '../../entities/user-role';

export interface UserAuthGet {
  id: number;
  userName: string;
  name: string;
  email: string;
  userRoles: UserRole[];
}
