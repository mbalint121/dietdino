import { Component, inject, OnInit } from '@angular/core';
import { EditUserComponentService } from '../common-service/edit-user-component.service';
import { AdminService } from '../admin-page/admin.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../common-service/user.service';
import { PopupService } from '../popups/popup.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  editUserComponentService: EditUserComponentService = inject(EditUserComponentService);
  adminService: AdminService = inject(AdminService);
  userService: UserService = inject(UserService);
  popupService: PopupService = inject(PopupService);
  router : Router = inject(Router);

  username! : string;
  newUsername! : string;
  newRole! : string;

  ngOnInit() {
    this.editUserComponentService.userDataChanged.subscribe(() => {
      this.setUserData();
    });
  }

  setUserData() {
    this.username = this.editUserComponentService.GetEditedUserName();
    this.newUsername = this.username;
    this.newRole = this.editUserComponentService.GetEditedUserRole();
  }

  EditUser() {
    if (!this.newUsername) {
      this.popupService.ShowPopup("Kérlek minden adatot adj meg", "error");
      return;
    }
    if(this.router.url.includes("/profile")){
      this.userService.UserEditSelf(this.newUsername);
    } else if(this.router.url.includes("/admin")){
      if(this.editUserComponentService.GetEditedUserName() != this.newUsername && this.editUserComponentService.GetEditedUserRole() != this.newRole){
        this.adminService.EditUserRole(this.editUserComponentService.GetEditedUserId(), this.newRole);
        this.adminService.EditUser(this.editUserComponentService.GetEditedUserId(), this.newUsername);
      } else if(this.editUserComponentService.GetEditedUserName() != this.newUsername && this.editUserComponentService.GetEditedUserRole() == this.newRole){
        this.adminService.EditUser(this.editUserComponentService.GetEditedUserId(), this.newUsername);
      } else if(this.editUserComponentService.GetEditedUserName() == this.newUsername && this.editUserComponentService.GetEditedUserRole() != this.newRole) {
        this.adminService.EditUserRole(this.editUserComponentService.GetEditedUserId(), this.newRole);
      }
      localStorage.removeItem("ID");
    }
  }

  ChangeEditUserComponentVisibility() {
    this.editUserComponentService.ChangeEditUserComponentVisibility();
  }
}