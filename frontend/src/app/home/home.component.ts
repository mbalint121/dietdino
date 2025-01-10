import { Component,inject } from '@angular/core';
import { PageNavbarComponent } from "../page-navbar/page-navbar.component";
import { PopupService } from "../popups/popup.service";
import { UserService } from '../common-service/user.service';

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

  ngOnInit(){
    if(this.userService.GetUserToken() == null){
      this.popupService.ShowPopup("Nem vagy bejelentkezve!", "information");
    }
  }
}
