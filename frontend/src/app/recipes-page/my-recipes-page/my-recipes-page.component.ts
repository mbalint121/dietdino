import { Component } from '@angular/core';
import { PageNavbarComponent } from '../../page-navbar/page-navbar.component';
import { UploadRecipesComponent } from "../upload-recipes/upload-recipes.component";
import { RecipeSearchBarComponent } from "../recipe-search-bar/recipe-search-bar.component";

@Component({
  selector: 'app-my-recipes-page',
  standalone: true,
  imports: [PageNavbarComponent, UploadRecipesComponent, RecipeSearchBarComponent],
  templateUrl: './my-recipes-page.component.html',
  styleUrl: './my-recipes-page.component.css'
})
export class MyRecipesPageComponent {

}
