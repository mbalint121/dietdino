import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { EditUserComponentService } from './edit-user-component.service';
import { AdminService } from '../admin-page/admin.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { PopupService } from '../popups/popup.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  editUserComponentService: EditUserComponentService = inject(EditUserComponentService);
  adminService: AdminService = inject(AdminService);
  userService: UserService = inject(UserService);
  popupService: PopupService = inject(PopupService);
  router : Router = inject(Router);
  destroyRef : DestroyRef = inject(DestroyRef);

  username! : string;
  newUsername! : string;
  newRole! : "Admin" | "Moderator" | "User" | undefined;

  constructor(){
    effect(() => {
      if(this.editUserComponentService.userData()){
        this.setUserData();
      }
    });
  }

  setUserData() {
    this.username = this.editUserComponentService.GetEditedUserName()!;
    this.newUsername = this.username;
    this.newRole = this.editUserComponentService.GetEditedUserRole();
  }

  EditUser() {
    if (!this.newUsername) {
      this.popupService.ShowPopup("Kérlek minden adatot adj meg", "error");
      return;
    }
    if(this.router.url.includes("/profile")){
      const subscription = this.userService.UserEditSelf(this.newUsername).subscribe();

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    } else if(this.router.url.includes("/admin")){
        let roleSubscription: Subscription | null = null;
        let nameSubscription: Subscription | null = null;

        const userId = this.editUserComponentService.GetEditedUserId();
        const currentUserName = this.editUserComponentService.GetEditedUserName();
        const currentUserRole = this.editUserComponentService.GetEditedUserRole();

        const isNameChanged = currentUserName !== this.newUsername;
        const isRoleChanged = currentUserRole !== this.newRole;

        if (isNameChanged && isRoleChanged) {
          roleSubscription = this.adminService.EditUserRole(userId, this.newRole).subscribe();
          nameSubscription = this.adminService.EditUser(userId, this.newUsername).subscribe();
        } else if (isNameChanged) {
          nameSubscription = this.adminService.EditUser(userId, this.newUsername).subscribe();
        } else if (isRoleChanged) {
          roleSubscription = this.adminService.EditUserRole(userId, this.newRole).subscribe();
        }
        
        this.destroyRef.onDestroy(() => {
          localStorage.removeItem("ID");
          if (roleSubscription) {
          roleSubscription.unsubscribe();
          }
          if (nameSubscription) {
            nameSubscription.unsubscribe();
          }
      });      
    }
    this.editUserComponentService.ChangeEditUserComponentVisibility();
  }

  ChangeEditUserComponentVisibility() {
    this.editUserComponentService.ChangeEditUserComponentVisibility();
  }
}