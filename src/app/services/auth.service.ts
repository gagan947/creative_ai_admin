import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

      setToken(token: string, roleUUID: string) {
            localStorage.setItem('CtiToken', token)
            localStorage.setItem('role_uuid', roleUUID);
      }

      getToken() {
            return localStorage.getItem('CtiToken')
      }

      isLogedIn() {
            return this.getToken() !== null
      }

      logout(): void {
            localStorage.removeItem('role_uuid');
      }

      getRoleUUID(): string | null {
            return localStorage.getItem('role_uuid');
      }
}