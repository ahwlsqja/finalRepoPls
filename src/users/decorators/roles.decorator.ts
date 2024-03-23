import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/types/userRole.type';

export const ROLES_KEY = 'user_roles;'
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);