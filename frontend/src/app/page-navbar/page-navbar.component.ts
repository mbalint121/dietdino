import { Component, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin-page/admin.service';

@Component({
  selector: 'app-page-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './page-navbar.component.html',
  styleUrl: './page-navbar.component.css'
})
export class PageNavbarComponent {
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
