import { Component, DestroyRef, inject } from '@angular/core';
import { AdminNavbarComponent } from "./admin-navbar/admin-navbar.component";
import { AdminDataRowStyleComponent } from "./admin-data-row-style/admin-data-row-style.component";
import { PopupComponent } from "../popups/popup/popup.component";
import { AdminService } from "./admin.service";
import { EditUserComponent } from "../edit-user/edit-user.component";
import { PopupService } from '../popups/popup.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';
import { AdminRecipeService } from './admin-recipe.service';
import { RecipeService } from '../recipes-page/recipe.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [AdminNavbarComponent, AdminDataRowStyleComponent, PopupComponent, EditUserComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  adminService : AdminService = inject(AdminService);
  adminRecipeService : AdminRecipeService = inject(AdminRecipeService);
  popupService : PopupService = inject(PopupService);
  destroyRef : DestroyRef = inject(DestroyRef);
  authService : AuthService = inject(AuthService);
  userService : UserService = inject(UserService);

  name! : string;

  async ngOnInit() {
    if(this.authService.IsTokenExpired(JSON.stringify(this.userService.GetUserToken()))){
      this.authService.LogOut();
      return;
    }
    if(!this.adminService.UserIsAdminOrModerator()){
      this.adminService.UserIsNotAuthorized();
      return;
    }

    this.name = JSON.parse(localStorage.getItem("user") || '{}').username;

    if(this.adminService.UserIsAdmin()){
      this.GetAllUsers();
      this.GetDraftRecipes();
    }

    this.GetWaitingRecipes();
  }



  GetAllUsers() {
    const subscription = this.adminService.GetAllUsers().subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetWaitingRecipes(){
    const subscription = this.adminRecipeService.GetWaitingRecipes().subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetDraftRecipes(){
    const subscription = this.adminRecipeService.GetDraftRecipes().subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
