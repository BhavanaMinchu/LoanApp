import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'loan-app';
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.currentUser = this.authService.getCurrentUser();
    });
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}
