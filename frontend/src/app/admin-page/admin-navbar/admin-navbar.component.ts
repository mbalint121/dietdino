import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { PageNavbarComponent } from "../../page-navbar/page-navbar.component";

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, PageNavbarComponent],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
  authService : AuthService = inject(AuthService);
  adminService : AdminService = inject(AdminService);
  
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  LogOut(){
    this.authService.LogOut();
  }
}
