import { Component } from '@angular/core';
import { PageNavbarComponent } from '../page-navbar/page-navbar.component';
import { RecipeSearchBarComponent } from "./recipe-search-bar/recipe-search-bar.component";

@Component({
  selector: 'app-recipes-page',
  standalone: true,
  imports: [PageNavbarComponent, RecipeSearchBarComponent],
  templateUrl: './recipes-page.component.html',
  styleUrl: './recipes-page.component.css'
})
export class RecipesPageComponent {

}
