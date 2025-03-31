import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { PageNavbarComponent } from '../page-navbar/page-navbar.component';
import { UserService } from '../services/user.service';
import { EditUserComponent } from "../edit-user/edit-user.component";
import { CommonModule } from '@angular/common';
import { EditUserComponentService } from '../edit-user/edit-user-component.service';
import { PopupService } from '../popups/popup.service';
import { User } from '../models/user.model';
import { UserRole } from '../models/user-role.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [PageNavbarComponent, EditUserComponent, CommonModule, RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  userService : UserService = inject(UserService);
  editUserComponentService : EditUserComponentService = inject(EditUserComponentService);
  popupService : PopupService = inject(PopupService);
  destroyRef : DestroyRef = inject(DestroyRef);
  
  username! : string;
  role! : UserRole | undefined;

  constructor(){  
    effect(() => {
      const user = this.userService.user();
      if(user){
        this.username = user.username!;
        this.role = user.role;
      }
    });
  }

  ChangeEditUserComponentVisibility(){
    this.editUserComponentService.GetEditedUserData(this.username, this.role);
    this.editUserComponentService.ChangeEditUserComponentVisibility();
  }

  DeleteUser(){
    if(this.userService.GetUserRole() == "Admin"){
      this.popupService.ShowPopup("Admin felhasználó nem törölheti önmagát!", "warning");
      return;
    }
    const subscription = this.userService.UserDeleteSelf().subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
