import { Component, DestroyRef, effect, inject } from '@angular/core';
import { PageNavbarComponent } from '../page-navbar/page-navbar.component';
import { UserService } from '../services/user.service';
import { EditUserComponent } from "../edit-user/edit-user.component";
import { CommonModule } from '@angular/common';
import { EditUserComponentService } from '../edit-user/edit-user-component.service';
import { PopupService } from '../popups/popup.service';
import { UserRole } from '../models/user-role.type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../recipes-page/recipe.service';
import { RecipeCardComponent } from "../recipes-page/recipe-card/recipe-card.component";
import ConfirmationDialogService from '../confirmation-dialog/confirmation-dialog.service';
import { PaginationComponent } from "../pagination/pagination.component";
import PaginationService from '../pagination/pagination.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [PageNavbarComponent, EditUserComponent, CommonModule, RouterLink, RecipeCardComponent, PaginationComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  userService : UserService = inject(UserService);
  editUserComponentService : EditUserComponentService = inject(EditUserComponentService);
  popupService : PopupService = inject(PopupService);
  recipeService : RecipeService = inject(RecipeService);
  paginationService : PaginationService = inject(PaginationService);
  confrimtaionDialogService : ConfirmationDialogService = inject(ConfirmationDialogService);
  route : ActivatedRoute = inject(ActivatedRoute);
  destroyRef : DestroyRef = inject(DestroyRef);
  
  loading : boolean = true;
  username : string = this.route.snapshot.params['username'] || this.userService.GetUsername() ;
  role! : UserRole | undefined;

  constructor(){  
    effect(() => {
      const user = this.userService.user();
      if(user){
        if(this.route.snapshot.params['username']){
          this.username = this.route.snapshot.params['username'];
        } else{
          this.username = user.username!;
        }
        this.role = user.role;
      }

      if(this.paginationService.GetCurrentRecipePage()){
        this.GetAcceptedRecipesByUsername(this.paginationService.GetCurrentRecipePage());
      }
    });
  }

  ngOnInit(){
    this.GetAcceptedRecipesByUsername(1);
  }

  ChangeEditUserComponentVisibility(){
    this.editUserComponentService.GetEditedUserData(this.username, this.role);
    this.editUserComponentService.ChangeEditUserComponentVisibility();
  }

  DeleteUser(){
    const confirmationDialogServiceSubscription = this.confrimtaionDialogService.OpenDialog("Biztosan törölni szeretnéd a felhasználói fiókodat?").subscribe(result => {
      if (result == "ok") {
        if(this.userService.GetUserRole() == "Admin"){
          this.popupService.ShowPopup("Admin felhasználó nem törölheti önmagát", "warning");
          return;
        }
        const subscription = this.userService.UserDeleteSelf().subscribe();
    
        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      confirmationDialogServiceSubscription.unsubscribe();
    });
  }

  GetAcceptedRecipesByUsername(currentPage: number = 1){
    const subscription = this.recipeService.GetAcceptedRecipesByUsername(this.username, currentPage).subscribe(() => this.loading = false);

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetRecipes(){
    return this.recipeService.GetRecipes();
  }
}
