import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-search-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-search-bar.component.html',
  styleUrl: './recipe-search-bar.component.css'
})
export class RecipeSearchBarComponent {
  router : Router = inject(Router);
}
