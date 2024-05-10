import { AddMap, IgnoreMap } from 'mapper-ts/lib-esm';
import { UserRolePostDto } from './user-role-post-dto';

@IgnoreMap('id')
export class UserPostDto {
  name?: string;
  email?: string;
  userName?: string;
  password?: string;
  @AddMap(UserRolePostDto)
  userRoles?: UserRolePostDto[];
}
