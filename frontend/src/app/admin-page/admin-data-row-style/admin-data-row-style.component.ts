import { Component, DestroyRef, inject, Input } from '@angular/core';
import { AdminService } from '../admin.service';
import { UserService } from '../../services/user.service';
import { PopupService } from '../../popups/popup.service';
import { EditUserComponentService } from '../../edit-user/edit-user-component.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-data-row-style',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-data-row-style.component.html',
  styleUrl: './admin-data-row-style.component.css'
})
export class AdminDataRowStyleComponent {
  @Input() numberOfCols!: string;
  @Input() type!: string;
  @Input() data!: any;

  adminService : AdminService = inject(AdminService);
  userService : UserService = inject(UserService);
  popupService : PopupService = inject(PopupService);
  editUserComponentService : EditUserComponentService = inject(EditUserComponentService);
  destroyRef : DestroyRef = inject(DestroyRef);

  DeleteUser(){
    if(this.adminService.UserIsAdmin() && this.userService.GetUsername() == this.data.username){
      this.popupService.ShowPopup("Admin felhasználó nem törölheti önmagát!", "warning");
      return;
    }
    const subscription = this.adminService.DeleteUser(this.data.ID!).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  ChangeEditUserComponentVisibility(){
    this.editUserComponentService.SetEditedUserId(this.data.ID);
    this.editUserComponentService.GetEditedUserData(this.data.username, this.data.role);
    this.editUserComponentService.ChangeEditUserComponentVisibility();
  }
}
