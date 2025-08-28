import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const current = this.auth.getCurrentUser();

    if (!current) {
      // not logged in
      this.router.navigate(['/login']);
      return false;
    }

    if (current.role === 'manager') {
      return true;
    }

    // logged in but not a manager: redirect to user dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
