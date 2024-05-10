import { AddMap } from 'mapper-ts/lib-esm';
import { UserRolePutDto } from './user-role-put-dto';

export class UserPutDto {
  id?: number;
  name?: string;
  email?: string;
  userName?: string;
  @AddMap('password')
  passwordReset?: string;
  @AddMap(UserRolePutDto)
  userRoles?: UserRolePutDto[];
}
