import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'users';
  private managersKey = 'managers';
  private currentUserKey = 'currentUser';

  constructor() {
    this.seedManagers();
  }

  // --- Seed two manager accounts (no registration needed) ---
  private seedManagers() {
    const existing = localStorage.getItem(this.managersKey);
    if (!existing) {
      const managers = [
        { id: 'M-001', name: 'Manager One',  email: 'manager1@loanapp.com', password: 'manager123', role: 'manager' },
        { id: 'M-002', name: 'Manager Two',  email: 'manager2@loanapp.com', password: 'manager123', role: 'manager' },
      ];
      localStorage.setItem(this.managersKey, JSON.stringify(managers));
    }
  }

  // --- Users (clients) ---
  registerUser(user: any) {
    const users = this.getAllUsers();
    const newUser = { ...user, role: 'user' }; // ensure role
    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  getAllUsers(): any[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }

  getAllManagers(): any[] {
    const data = localStorage.getItem(this.managersKey);
    return data ? JSON.parse(data) : [];
  }

  // --- Role-based login (accepts optional displayName for users without one) ---
  login(email: string, password: string, displayName?: string):
    { success: boolean; role?: 'user'|'manager'; user?: any } {

    // Check managers first
    const managers = this.getAllManagers();
    const m = managers.find(x => x.email === email && x.password === password);
    if (m) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(m));
      return { success: true, role: 'manager', user: m };
    }

    // Then check users
    const users = this.getAllUsers();
    const idx = users.findIndex(x => x.email === email && x.password === password);
    if (idx > -1) {
      // Backfill name if missing and provided
      if ((!users[idx].name || users[idx].name.trim() === '') && displayName) {
        users[idx] = { ...users[idx], name: displayName };
        localStorage.setItem(this.usersKey, JSON.stringify(users));
      }

      const userWithRole = { ...users[idx], role: users[idx].role || 'user' };
      localStorage.setItem(this.currentUserKey, JSON.stringify(userWithRole));
      return { success: true, role: 'user', user: userWithRole };
    }

    return { success: false };
  }

  // compatibility
  loginUser(email: string, password: string): boolean {
    const res = this.login(email, password);
    return !!res.success;
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser() {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
  }
}
