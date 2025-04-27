import { Component, effect, inject, Input, signal } from '@angular/core';
import { RecipeService } from '../recipes-page/recipe.service';
import { CommonModule } from '@angular/common';
import PaginationService from './pagination.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() type : string = 'recipes';
  @Input() totalPageCount : number = 0;
  recipeService: RecipeService = inject(RecipeService);
  paginationService: PaginationService = inject(PaginationService);
  router: Router = inject(Router);
  numberOfPages: number[] = [];

  currentPage = signal(1);

  constructor() {
    effect(() => {
      if(this.router.url.includes("recipes")){
        this.totalPageCount = this.recipeService.totalRecipesPageCount() ?? 0;
      }
      this.numberOfPages = Array.from({ length: this.totalPageCount }, (_, i) => i + 1);

      if(this.type === 'recipes') {
        this.paginationService.SetCurrentRecipePage(this.currentPage());
      } else if(this.type === 'users') {
        this.paginationService.SetCurrentUserPage(this.currentPage());
      } else if(this.type === 'waiting-recipes') {
        this.paginationService.SetCurrentWaitingRecipePage(this.currentPage());
      } else if(this.type === 'draft-recipes') {
        this.paginationService.SetCurrentDraftRecipePage(this.currentPage());
      }
    }, { allowSignalWrites: true });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.paginationService.ResetValues();
      }
    });
  }

  GetVisiblePageNumbers(): number[] {
    const currentPage = this.currentPage();
    const totalPages = this.numberOfPages.length;
    
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}
