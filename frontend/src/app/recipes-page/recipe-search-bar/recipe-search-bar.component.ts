import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-search-bar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './recipe-search-bar.component.html',
  styleUrl: './recipe-search-bar.component.css'
})
export class RecipeSearchBarComponent {
  router : Router = inject(Router);
  recipeService : RecipeService = inject(RecipeService);
  destroyRef : DestroyRef = inject(DestroyRef);

  searchString : string = "";
  isFilterVisible : boolean = false;
  selectedFilter! : string;

  SearchRecipes(){
    const subscription = this.recipeService.SearchInRecipes(this.searchString);

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  SearchRecipesOnEnter(event: KeyboardEvent){
    if(event.key == "Enter"){
      this.SearchRecipes();
    }
  }

  ChangeFilterVisibility(){
    this.isFilterVisible = !this.isFilterVisible;
  }

  
}
