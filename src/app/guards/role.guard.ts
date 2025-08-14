import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthorizationService } from '../services/authorization.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
      constructor(private auth: AuthService, private authz: AuthorizationService, private router: Router) { }

      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
            const fullPath = state.url;
            const perms = this.authz.getRoutePermissions(fullPath);
            if (perms.view) return true;

            this.router.navigate(['/']);
            return false;
      }
}