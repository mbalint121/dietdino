import { Component, inject} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin-page/admin.service';
import { UserService } from '../services/user.service';

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
  userService : UserService = inject(UserService);
  route : ActivatedRoute = inject(ActivatedRoute);

  menuOpen = false;

  ngOnInit(){
    if(this.userService.GetUserToken() == null){
      this.authService.router.navigate(["/"]);
      return;
    }
    if(this.authService.IsTokenExpired(JSON.stringify(this.userService.GetUserToken()))){
      this.authService.LogOut();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  LogOut(){
    this.authService.LogOut();
  }
}
