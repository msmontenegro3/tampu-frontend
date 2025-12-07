import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthHelperService } from '../../core/auth-helper.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
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
}
