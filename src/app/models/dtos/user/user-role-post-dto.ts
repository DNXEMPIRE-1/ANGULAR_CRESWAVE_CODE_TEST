import { IgnoreMap } from 'mapper-ts/lib-esm';

@IgnoreMap('id')
export class UserRolePostDto {
  roleId?: number;
}
