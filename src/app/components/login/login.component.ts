import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { name: '', email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const result = this.authService.login(
      this.credentials.email,
      this.credentials.password,
      this.credentials.name?.trim() || undefined
    );

    if (result.success) {
      if (result.role === 'manager') {
        this.router.navigate(['/manager']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      alert('Invalid email or password!');
    }
  }
}
