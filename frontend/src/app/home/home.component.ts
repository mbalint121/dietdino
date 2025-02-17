import { Component,inject } from '@angular/core';
import { PageNavbarComponent } from "../page-navbar/page-navbar.component";
import { PopupService } from "../popups/popup.service";
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageNavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  popupService: PopupService = inject(PopupService);
  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);

  ngOnInit(){
    if(this.userService.GetUserToken() == null){
      this.popupService.ShowPopup("Nem vagy bejelentkezve!", "information");
    }
  }
}
