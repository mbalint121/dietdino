import { Component, inject } from '@angular/core';
import { AdminNavbarComponent } from "./admin-navbar/admin-navbar.component";
import { AdminDataRowStyleComponent } from "./admin-data-row-style/admin-data-row-style.component";
import { PopupComponent } from "../popups/popup/popup.component";
import { AdminService } from "./admin.service";
import { EditUserComponent } from "../edit-user/edit-user.component";
import { PopupService } from '../popups/popup.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [AdminNavbarComponent, AdminDataRowStyleComponent, PopupComponent, EditUserComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  adminService : AdminService = inject(AdminService);
  popupService : PopupService = inject(PopupService);
  name! : string;
  users! : [any];

  async ngOnInit() {
    if(!this.adminService.UserIsAdminOrModerator()){
      this.adminService.UserIsNotAuthorized();
      return;
    }

    this.name = JSON.parse(localStorage.getItem("user") || '{}').username;

    if(this.adminService.UserIsAdmin()){
      await this.GetAllUsers();
    }
    if(localStorage.getItem("popup")){
      this.popupService.LoadPopup();
    }
  }



  async GetAllUsers() {
    this.users = await this.adminService.GetAllUsers();
  }

}
