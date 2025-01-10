import { Component, inject } from '@angular/core';
import { PageNavbarComponent } from '../page-navbar/page-navbar.component';
import { UserService } from '../common-service/user.service';
import { EditUserComponent } from "../edit-user/edit-user.component";
import { CommonModule } from '@angular/common';
import { EditUserComponentService } from '../common-service/edit-user-component.service';
import { PopupService } from '../popups/popup.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [PageNavbarComponent, EditUserComponent, CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  userService : UserService = inject(UserService);
  editUserComponentService : EditUserComponentService = inject(EditUserComponentService);
  popupService : PopupService = inject(PopupService);

  username : string = this.userService.GetUsername();
  role : string = this.userService.GetUserRole();
  
  ngOnInit(){
    if(localStorage.getItem("popup")){
      this.popupService.LoadPopup();
    }
  }

  ChangeEditUserComponentVisibility(){
    this.editUserComponentService.GetEditedUserData(this.username, this.role);
    this.editUserComponentService.ChangeEditUserComponentVisibility();
  }
}
