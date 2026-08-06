import { UserRoles } from '../../../enums/user-roles.enum'; 

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRoles;
}