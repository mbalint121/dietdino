import { Component, DestroyRef, Input, inject } from '@angular/core';
import { Recipe } from '../../models/recipe';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { FavoriteService } from '../../services/favorite.service';
import { LikeService } from '../../services/like.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;
  recipeService : RecipeService = inject(RecipeService);
  favoriteService : FavoriteService = inject(FavoriteService);
  likeService : LikeService = inject(LikeService);
  destroyRef : DestroyRef = inject(DestroyRef);
  route : ActivatedRoute = inject(ActivatedRoute);

  formatDate(date: Date): string {
    return this.recipeService.formatDate(date);
  }

  FavoriteRecipe(){
    const subscription = this.favoriteService.FavoriteRecipe(this.recipe).subscribe(() => {
      if(this.route.snapshot.url[0].path == "my-favorite-recipes"){
        this.recipeService.GetFavoriteRecipes().subscribe();
      }
      this.recipe.userHasFavorited = !this.recipe.userHasFavorited;
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
