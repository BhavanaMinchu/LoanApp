import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service'; // ✅ import the service

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  
  currentYear = new Date().getFullYear();

  constructor(private authService: AuthService) {}  // ✅ inject the service

  ngOnInit(): void {
    // ✅ log out user whenever landing page is opened
    this.authService.logout();
  }
}
