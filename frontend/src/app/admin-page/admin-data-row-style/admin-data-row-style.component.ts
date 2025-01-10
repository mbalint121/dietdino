import { Component, inject, Input } from '@angular/core';
import { AdminService } from '../admin.service';
import { UserService } from '../../common-service/user.service';
import { PopupService } from '../../popups/popup.service';
import { EditUserComponentService } from '../../common-service/edit-user-component.service';

@Component({
  selector: 'app-admin-data-row-style',
  standalone: true,
  imports: [],
  templateUrl: './admin-data-row-style.component.html',
  styleUrl: './admin-data-row-style.component.css'
})
export class AdminDataRowStyleComponent {
  @Input() numberOfCols!: string;
  @Input() type!: string;
  @Input() user!: any;

  adminService : AdminService = inject(AdminService);
  userService : UserService = inject(UserService);
  popupService : PopupService = inject(PopupService);
  editUserComponentService : EditUserComponentService = inject(EditUserComponentService);

  DeleteUser(){
    if(this.adminService.UserIsAdmin() && this.userService.GetUsername() == this.user.username){
      this.popupService.ShowPopup("Nem törölheted önmagad!", "warning");
      return;
    }
    this.adminService.DeleteUser(this.user.ID);
  }

  ChangeEditUserComponentVisibility(){
    localStorage.setItem("ID", this.user.ID);
    this.editUserComponentService.GetEditedUserData(this.user.username, this.user.role);
    this.editUserComponentService.ChangeEditUserComponentVisibility();
  }
}
