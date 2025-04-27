import { Component, DestroyRef, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PageNavbarComponent } from "../../page-navbar/page-navbar.component";
import { Recipe } from '../../models/recipe';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../admin-page/admin.service';
import { AdminRecipeService } from '../../admin-page/admin-recipe.service';
import { PopupService } from '../../popups/popup.service';
import { CommentComponent } from "../../comment/comment.component";
import { FormsModule } from '@angular/forms';
import { Comment } from '../../models/comment';
import { FavoriteService } from '../../services/favorite.service';
import { LikeService } from '../../services/like.service';
import { CommentService } from '../../comment/comment.service';
import { ImageService } from '../../services/image.service';
import ConfirmationDialogService from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-recipe-page',
  standalone: true,
  imports: [PageNavbarComponent, CommentComponent, FormsModule, RouterLink],
  templateUrl: './recipe-page.component.html',
  styleUrl: './recipe-page.component.css'
})
export class RecipePageComponent {
  recipeService : RecipeService = inject(RecipeService);
  userService : UserService = inject(UserService);
  adminService : AdminService = inject(AdminService);
  adminRecipeService : AdminRecipeService = inject(AdminRecipeService);
  favoriteService : FavoriteService = inject(FavoriteService);
  likeService : LikeService = inject(LikeService);
  commentService : CommentService = inject(CommentService);
  popupService : PopupService = inject(PopupService);
  imageService : ImageService = inject(ImageService);
  confirmationDialogService : ConfirmationDialogService = inject(ConfirmationDialogService);
  router : Router = inject(Router);
  route : ActivatedRoute = inject(ActivatedRoute);
  destroyRef : DestroyRef = inject(DestroyRef);

  id : number = Number(this.route.snapshot.paramMap.get('id'));
  recipe = signal<Recipe | undefined>(undefined);
  text : string = "";
  loading : boolean = true;

  constructor(){
    this.SetCurrentRecipe();
  }
  
  RunTests(){
    if(this.route.snapshot.url[0].path == "waiting-recipe"){
      if(!this.adminService.UserIsAdminOrModerator()){
        this.router.navigate(["/"]);
        this.popupService.ShowPopup("Ennek az oldalnak a megtekintéséhez nincs jogod!", "warning");
        return;
      }
      else if(this.recipe()?.state != "Waiting"){
        this.router.navigate(["/"]);
        this.popupService.ShowPopup("Ez a recept nem egy várakozó recept!", "warning")
        return;
      }
    }
    else if(this.route.snapshot.url[0].path == "draft-recipe"){
      if(!this.adminService.UserIsAdmin()){
        this.router.navigate(["/"]);
        this.popupService.ShowPopup("Ennek az oldalnak a megtekintéséhez nincs jogod!", "warning");
        return;
      }
      else if(this.recipe()?.state != "Draft"){
        this.router.navigate(["/"]);
        this.popupService.ShowPopup("Ez a recept nem egy piszkozat recept!", "warning")
        return;
      }
    }
  }

  formatDate(date: Date): string {
    return this.recipeService.formatDate(date);
  }

  GetCurrentRecipe(){
    return this.recipeService.GetRecipeById(this.id);
  }

  SetCurrentRecipe(){
    const subscription = this.GetCurrentRecipe().subscribe((response : any) => {
      this.recipe.set(response.recipe);
      this.RunTests();
      this.GetComments();
      this.loading = false;
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  EditRecipe(){
    this.router.navigate(['/edit-recipe', this.recipe()?.ID]);
  }

  DeleteRecipe(){
    this.confirmationDialogService.OpenDialog("Biztosan törölni szeretnéd ezt a receptet?").subscribe(result => {
      if(result == "ok"){
        const subscription = this.recipeService.DeleteRecipeByID(this.recipe()?.ID!, this.recipe()?.uploader!).subscribe();
    
        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
      }
    });
  }

  LikeRecipe(){
    const likeSubscription = this.likeService.LikeRecipe(this.recipe()!).subscribe(() => {
      this.SetCurrentRecipe();
    });

    this.destroyRef.onDestroy(() => {
      likeSubscription.unsubscribe();
    });
  }

  AcceptRecipe(){
    const confirmationDialogServiceSubscription = this.confirmationDialogService.OpenDialog("Biztosan elfogadod ezt a receptet?").subscribe(result => {
      if(result == "ok"){
        const subscription = this.adminRecipeService.AcceptRecipe(this.recipe()?.ID!).subscribe();

        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      confirmationDialogServiceSubscription.unsubscribe();
    });
  }

  RejectRecipe(){
    const confirmationDialogServiceSubscription = this.confirmationDialogService.OpenDialog("Biztosan elutasítod ezt a receptet?").subscribe(result => {
      if(result == "ok"){
        const subscription = this.adminRecipeService.RejectRecipe(this.recipe()?.ID!).subscribe();

        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      confirmationDialogServiceSubscription.unsubscribe();
    });
  }

  FavoriteRecipe(){
    const subscription = this.favoriteService.FavoriteRecipe(this.recipe()!).subscribe(() => {
      this.SetCurrentRecipe();
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetComments(){
    const subscription = this.commentService.GetCommentsByRecipeID(this.id).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  NewComment(){
    const comment : Comment = { text: this.text , recipeID: this.id , author: this.userService.GetUsername(), commentDateTime: new Date() };
    const subscription = this.commentService.NewComment(comment).subscribe(() => {
      this.GetComments();
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    this.text = "";
  }

  FormatTimeToText(timeString: string): string {
    const [hours, minutes] = timeString.split(":").map(Number);
    let result = [];

    if (hours > 0) result.push(`${hours} óra`);
    if (minutes > 0) result.push(`${minutes} perc`);

    return result.join(" ") || "Nincs ilyen adat";
  }
}
