import { Component, DestroyRef, effect, inject } from '@angular/core';
import { PageNavbarComponent } from '../page-navbar/page-navbar.component';
import { RecipeSearchBarComponent } from "./recipe-search-bar/recipe-search-bar.component";
import { RecipeCardComponent } from "./recipe-card/recipe-card.component";
import { RecipeService } from './recipe.service';
import { UserService } from '../services/user.service';
import { PaginationComponent } from "../pagination/pagination.component";
import { ActivatedRoute } from '@angular/router';
import PaginationService from '../pagination/pagination.service';

@Component({
  selector: 'app-recipes-page',
  standalone: true,
  imports: [PageNavbarComponent, RecipeSearchBarComponent, RecipeCardComponent, PaginationComponent],
  templateUrl: './recipes-page.component.html',
  styleUrl: './recipes-page.component.css'
})
export class RecipesPageComponent {
  recipeService: RecipeService = inject(RecipeService);
  userService : UserService = inject(UserService);
  paginationService : PaginationService = inject(PaginationService);
  destroyRef : DestroyRef = inject(DestroyRef);
  route : ActivatedRoute = inject(ActivatedRoute);

  loading : boolean = true;

  constructor() {
    
    effect(() => {
      if(this.paginationService.GetCurrentRecipePage()){
        this.GetAcceptedRecipes(this.paginationService.GetCurrentRecipePage());
      }
    });
  }

  ngOnInit(){
    if(this.userService.GetUserToken !== null){
      this.GetAcceptedRecipes();
    }
  }

  GetAcceptedRecipes(currentPage: number = 1){
    const subscription = this.recipeService.GetAcceptedRecipes(currentPage).subscribe(() => this.loading = false);
  
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetRecipes(){
    return this.recipeService.GetRecipes();
  }
}
