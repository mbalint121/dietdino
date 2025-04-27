import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
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
import { PaginationComponent } from "../pagination/pagination.component";
import PaginationService from '../pagination/pagination.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [AdminNavbarComponent, AdminDataRowStyleComponent, PopupComponent, EditUserComponent, PaginationComponent],
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
  paginationService : PaginationService = inject(PaginationService);

  name! : string;
  usersLoaded : boolean = false;
  usersPageCount! : number;
  draftRecipesLoaded : boolean = false;
  draftRecipesPageCount! : number;
  waitingRecipesLoaded : boolean = false;
  waitingRecipesPageCount! : number;

  constructor() {
    effect(() => {
      if(this.adminService.UserIsAdmin()){
        if(this.paginationService.GetCurrentUserPage()){
          this.GetAllUsers(this.paginationService.GetCurrentUserPage());
        }
        if(this.paginationService.GetCurrentDraftRecipePage()){
          this.GetDraftRecipes(this.paginationService.GetCurrentDraftRecipePage());
        }
      }
      if(this.paginationService.GetCurrentWaitingRecipePage()){
        this.GetWaitingRecipes(this.paginationService.GetCurrentWaitingRecipePage());
      }
    });

  }

  async ngOnInit() {
    if(this.authService.IsTokenExpired(JSON.stringify(this.userService.GetUserToken()))){
      this.authService.LogOut();
      return;
    }
    if(!this.adminService.UserIsAdminOrModerator()){
      this.adminService.UserIsNotAuthorized();
      return;
    }

    this.paginationService.SetPageLimit(5);

    this.name = JSON.parse(localStorage.getItem("user") || '{}').username;

    if(this.adminService.UserIsAdmin()){
      this.GetAllUsers();
      this.GetDraftRecipes();
    }

    this.GetWaitingRecipes();
  }

  GetAllUsers(currentPage: number = 1){
    const subscription = this.adminService.GetAllUsers(currentPage).subscribe(response => {
      this.usersLoaded = true;
      this.usersPageCount = response.totalPageCount;
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetWaitingRecipes(currentPage : number = 1){
    const subscription = this.adminRecipeService.GetWaitingRecipes(currentPage).subscribe(response => {
      this.waitingRecipesLoaded = true;
      this.waitingRecipesPageCount = response.totalPageCount;
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetDraftRecipes(currentPage : number = 1){
    const subscription = this.adminRecipeService.GetDraftRecipes(currentPage).subscribe(response => {
      this.draftRecipesLoaded = true;
      this.draftRecipesPageCount = response.totalPageCount;
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
