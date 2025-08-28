import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'users';
  private managersKey = 'managers';
  private currentUserKey = 'currentUser';
  private loanApplicationsKey = 'loanApplications';

  constructor() {
    this.seedManagers();
  }

  // ---- IDs ----
  private generateUserId(): string {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `U-${Date.now()}-${rand}`;
  }

  public newLoanId(): string {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `L-${Date.now()}-${rand}`;
  }

  // ---- Managers seed ----
  private seedManagers() {
    const existing = localStorage.getItem(this.managersKey);
    if (!existing) {
      const managers = [
        { id: 'M-001', name: 'Manager One', email: 'manager1@loanapp.com', password: 'manager123', role: 'manager' },
        { id: 'M-002', name: 'Manager Two', email: 'manager2@loanapp.com', password: 'manager123', role: 'manager' }
      ];
      localStorage.setItem(this.managersKey, JSON.stringify(managers));
    }
  }

  getAllManagers(): any[] {
    const m = localStorage.getItem(this.managersKey);
    return m ? JSON.parse(m) : [];
  }

  // ---- Users ----
  getAllUsers(): any[] {
    const u = localStorage.getItem(this.usersKey);
    return u ? JSON.parse(u) : [];
  }

  registerUser(user: { fullName?: string; email: string; password: string; phone?: string }) {
    const users = this.getAllUsers();
    const exists = users.some((x: any) => x.email === user.email);
    if (exists) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: this.generateUserId(),
      name: (user.fullName?.trim() || user.email.split('@')[0]).trim(),
      email: user.email,
      password: user.password,
      phone: user.phone || '',
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return { success: true, user: newUser };
  }

  // ---- Login ----
  login(email: string, password: string, displayName?: string) {
    // managers first
    const managers = this.getAllManagers();
    const m = managers.find(x => x.email === email && x.password === password);
    if (m) {
      const managerWithRole = { ...m, role: 'manager' };
      localStorage.setItem(this.currentUserKey, JSON.stringify(managerWithRole));
      return { success: true, role: 'manager', user: managerWithRole };
    }

    // users
    const users = this.getAllUsers();
    const idx = users.findIndex(x => x.email === email && x.password === password);
    if (idx > -1) {
      let u = { ...users[idx] };

      // backfill id/name if older data missing
      if (!u.id) u.id = this.generateUserId();
      if (!u.name || !u.name.trim()) {
        u.name = (displayName?.trim() || u.fullName?.trim() || email.split('@')[0]).trim();
      }

      users[idx] = u;
      localStorage.setItem(this.usersKey, JSON.stringify(users));
      const userWithRole = { ...u, role: 'user' };
      localStorage.setItem(this.currentUserKey, JSON.stringify(userWithRole));
      return { success: true, role: 'user', user: userWithRole };
    }

    return { success: false };
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser() {
    const s = localStorage.getItem(this.currentUserKey);
    return s ? JSON.parse(s) : null;
  }

  isManager(): boolean {
    const u = this.getCurrentUser();
    return !!(u && u.role === 'manager');
  }

  // ---- Loans helpers ----
  getAllLoans(): any[] {
    const l = localStorage.getItem(this.loanApplicationsKey);
    return l ? JSON.parse(l) : [];
  }

  saveAllLoans(loans: any[]) {
    localStorage.setItem(this.loanApplicationsKey, JSON.stringify(loans));
  }
}
