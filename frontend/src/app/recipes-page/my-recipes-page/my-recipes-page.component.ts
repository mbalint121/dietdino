import { Component, DestroyRef, inject } from '@angular/core';
import { PageNavbarComponent } from '../../page-navbar/page-navbar.component';
import { RecipeSearchBarComponent } from "../recipe-search-bar/recipe-search-bar.component";
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';
import { RecipeService } from '../recipe.service';
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-recipes-page',
  standalone: true,
  imports: [PageNavbarComponent, RecipeSearchBarComponent, RecipeCardComponent],
  templateUrl: './my-recipes-page.component.html',
  styleUrl: './my-recipes-page.component.css'
})
export class MyRecipesPageComponent {
  recipeService : RecipeService = inject(RecipeService);
  userService : UserService = inject(UserService);
  destroyRef : DestroyRef = inject(DestroyRef);

  loading : boolean = true;

  ngOnInit(){
    if(this.userService.GetUserToken !== null){
      const subcription = this.recipeService.GetRecipesByUser().subscribe(() => this.loading = false);

      this.destroyRef.onDestroy(() => {
        subcription.unsubscribe();
      });
    }

  }
  
  GetRecipes(){
    return this.recipeService.GetRecipes();
  }
}
