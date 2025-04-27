import { Component, DestroyRef, Input, inject } from '@angular/core';
import { Recipe } from '../../models/recipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { FavoriteService } from '../../services/favorite.service';
import { LikeService } from '../../services/like.service';
import { ImageService } from '../../services/image.service';
import PaginationService from '../../pagination/pagination.service';

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
  imageService: ImageService = inject(ImageService);
  paginationService : PaginationService = inject(PaginationService);
  destroyRef : DestroyRef = inject(DestroyRef);
  route : ActivatedRoute = inject(ActivatedRoute);
  router : Router = inject(Router);

  formatDate(date: Date): string {
    return this.recipeService.formatDate(date);
  }

  FavoriteRecipe(){
    const subscription = this.favoriteService.FavoriteRecipe(this.recipe).subscribe(() => {
      if(this.route.snapshot.url[0].path == "my-favorite-recipes"){
        const routeSubscription = this.route.params.subscribe(() => {
          const neededPageCount = Math.ceil(this.recipeService.GetRecipes().length / this.paginationService.GetPageLimit());
          const pageCount = this.paginationService.GetCurrentRecipePage() > neededPageCount ? neededPageCount : this.paginationService.GetCurrentRecipePage();
          const subscription = this.recipeService.GetFavoriteRecipes(pageCount).subscribe();
    
          this.destroyRef.onDestroy(() => {
            subscription.unsubscribe();
          });
        });
  
        this.destroyRef.onDestroy(() => {
          routeSubscription.unsubscribe();
        });
      }
      this.recipe.userHasFavorited = !this.recipe.userHasFavorited;
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
