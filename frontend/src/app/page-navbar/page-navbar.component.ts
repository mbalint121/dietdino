import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-page-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-navbar.component.html',
  styleUrl: './page-navbar.component.css'
})
export class PageNavbarComponent {
  authService : AuthService = inject(AuthService);

  LogOut(){
    this.authService.LogOut();
  }
}
