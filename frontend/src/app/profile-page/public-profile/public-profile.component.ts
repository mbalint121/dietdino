import { Component, DestroyRef, inject } from '@angular/core';
import { PageNavbarComponent } from "../../page-navbar/page-navbar.component";
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../recipes-page/recipe.service';
import { RecipeCardComponent } from "../../recipes-page/recipe-card/recipe-card.component";

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [PageNavbarComponent, RecipeCardComponent],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.css'
})
export class PublicProfileComponent {
  route : ActivatedRoute = inject(ActivatedRoute);
  recipeService : RecipeService = inject(RecipeService);
  destroyRef : DestroyRef = inject(DestroyRef);

  username : string = this.route.snapshot.url[1].path;

  ngOnInit(){
    const subscription = this.recipeService.GetAcceptedRecipesByUsername(this.username).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  GetRecipes(){
    return this.recipeService.GetRecipes();
  }
}
