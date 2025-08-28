import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    fullName: '',
    email: '',
    password: '',
    phone: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const res = this.authService.registerUser(this.user);
    if (res.success) {
      alert('User Registered Successfully! Please login.');
      this.user = { fullName: '', email: '', password: '', phone: '' };
      this.router.navigate(['/login']);
    } else {
      alert(res.message || 'Registration failed');
    }
  }
}
