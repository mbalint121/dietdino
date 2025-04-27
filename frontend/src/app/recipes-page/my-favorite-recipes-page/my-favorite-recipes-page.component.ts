import { Component, DestroyRef, effect, inject } from '@angular/core';
import { PageNavbarComponent } from '../../page-navbar/page-navbar.component';
import { RecipeSearchBarComponent } from "../recipe-search-bar/recipe-search-bar.component";
import { RecipeService } from '../recipe.service';
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { UserService } from '../../services/user.service';
import { PaginationComponent } from "../../pagination/pagination.component";
import { ActivatedRoute } from '@angular/router';
import PaginationService from '../../pagination/pagination.service';

@Component({
  selector: 'app-my-favorite-recipes-page',
  standalone: true,
  imports: [PageNavbarComponent, RecipeSearchBarComponent, RecipeCardComponent, PaginationComponent],
  templateUrl: './my-favorite-recipes-page.component.html',
  styleUrl: './my-favorite-recipes-page.component.css'
})
export class MyFavoriteRecipesPageComponent {
  recipeService: RecipeService = inject(RecipeService);
  userService : UserService = inject(UserService);
  paginationService : PaginationService = inject(PaginationService);
  route : ActivatedRoute = inject(ActivatedRoute);
  destroyRef : DestroyRef = inject(DestroyRef);

  loading : boolean = true;

  constructor() {
    effect(() => {
      if(this.paginationService.GetCurrentRecipePage()){
        this.GetFavoriteRecipes(this.paginationService.GetCurrentRecipePage());
      }
    });
  }

  ngOnInit(){
    if(this.userService.GetUserToken !== null){
      this.GetFavoriteRecipes();
    }
  }

  GetFavoriteRecipes(currentPage: number = 1){
    const subscription = this.recipeService.GetFavoriteRecipes(currentPage).subscribe(() => this.loading = false);
  
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetRecipes(){
    return this.recipeService.GetRecipes();
  }
}
