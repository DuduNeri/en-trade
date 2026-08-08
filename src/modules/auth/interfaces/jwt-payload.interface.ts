import { UserRoles } from '../../../enums/user-roles.enum'; 

export interface JwtPayload {
  id: string,
  sub: string;
  email: string;
  role: UserRoles;
}