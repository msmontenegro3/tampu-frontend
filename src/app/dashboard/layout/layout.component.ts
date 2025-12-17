import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthHelperService } from '../../core/auth-helper.service';
import { AuthService } from '../../core/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faHouse,
  faCalendarDay,
  faListCheck,
  faUser,
  faBarsProgress,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  /* ICONS FONT AWESOME */
  hamburguesaIcon = faBars;
  houseIcon = faHouse;
  calendarIcon = faCalendarDay;
  listCheckIcon = faListCheck;
  progressIcon = faBarsProgress;
  userIcon = faUser;

  role: string | null = null;

  constructor(
    private authHelperService: AuthHelperService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authHelperService.getCurrentUserRole();
  }

  logout(): void {
    this.authService.logout();
  }

  /* UI */
  isMobileMenuOpen: boolean = false;
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
