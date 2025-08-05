import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ROLE_PERMISSIONS } from '../config/role-permissions.config';
import { Permission } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
      constructor(private authService: AuthService) { }

      getRoutePermissions(path: string): Permission {
            const segments = path.split('/');
            if (!isNaN(Number(segments[segments.length - 1]))) {
                  segments.pop();
            }
            const normalizedPath = segments.join('/');
            const roleUUID = this.authService.getRoleUUID();
            const allPermissions = ROLE_PERMISSIONS[roleUUID || ''] || {};
            return allPermissions[normalizedPath] || {};
      }

      hasRoutePermission(route: string, action: keyof Permission): boolean {
            const perms = this.getRoutePermissions(route);
            return !!perms[action];
      }
}