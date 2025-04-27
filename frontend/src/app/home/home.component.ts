import { Component,DestroyRef,HostListener,inject } from '@angular/core';
import { PageNavbarComponent } from "../page-navbar/page-navbar.component";
import { PopupService } from "../popups/popup.service";
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes-page/recipe.service';
import { RecipeCardComponent } from "../recipes-page/recipe-card/recipe-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageNavbarComponent, RecipeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  popupService: PopupService = inject(PopupService);
  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  recipeService : RecipeService = inject(RecipeService);

  destroyRef : DestroyRef = inject(DestroyRef);

  loading: boolean = true;

  ngOnInit(){
    if(this.userService.GetUserToken() == null){
      this.popupService.ShowPopup("Nem vagy bejelentkezve!", "information");
    }

    this.GetRecipes();
  }

  GetHottestRecipes(){
    return this.recipeService.GetHotRecipes();
  }

  GetFreshestRecipes(){
   return this.recipeService.GetFreshRecipes().subscribe();
  }

  GetRecipes(){
    const freshestRecipesSubscription = this.recipeService.GetFreshRecipes().subscribe(() =>{
      const hottestRecipesSubscription = this.recipeService.GetHotRecipes().subscribe(() =>{
        this.loading = false;
      })

      this.destroyRef.onDestroy(() => {
        hottestRecipesSubscription.unsubscribe();
      });
    });

    this.destroyRef.onDestroy(() => {
      freshestRecipesSubscription.unsubscribe();
    });
  }

  GetPopularRecipes(){
    return this.recipeService.GetPopularRecipes();
  }

  GetNewRecipes(){
    return this.recipeService.GetNewRecipes();
  }


}
