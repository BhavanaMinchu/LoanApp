import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';   // ✅ FIXED PATH

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

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.registerUser(this.user);
    alert('User Registered Successfully!');
    console.log('User Registered:', this.user);
  }
}
