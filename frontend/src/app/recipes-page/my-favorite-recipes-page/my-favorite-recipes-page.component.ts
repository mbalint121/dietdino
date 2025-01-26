import { Component } from '@angular/core';
import { PageNavbarComponent } from '../../page-navbar/page-navbar.component';
import { RecipeSearchBarComponent } from "../recipe-search-bar/recipe-search-bar.component";

@Component({
  selector: 'app-my-favorite-recipes-page',
  standalone: true,
  imports: [PageNavbarComponent, RecipeSearchBarComponent],
  templateUrl: './my-favorite-recipes-page.component.html',
  styleUrl: './my-favorite-recipes-page.component.css'
})
export class MyFavoriteRecipesPageComponent {

}
