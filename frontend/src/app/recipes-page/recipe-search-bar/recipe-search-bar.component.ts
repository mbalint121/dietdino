import { Component, DestroyRef, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../popups/popup.service';
import { DateFilter } from '../../models/date-filter';
import PaginationService from '../../pagination/pagination.service';

@Component({
  selector: 'app-recipe-search-bar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './recipe-search-bar.component.html',
  styleUrl: './recipe-search-bar.component.css'
})
export class RecipeSearchBarComponent {
  route : ActivatedRoute = inject(ActivatedRoute);
  router : Router = inject(Router);
  recipeService : RecipeService = inject(RecipeService);
  popupService : PopupService = inject(PopupService);
  paginationService : PaginationService = inject(PaginationService);

  destroyRef : DestroyRef = inject(DestroyRef);

  searchString : string = "";
  isFilterVisible : boolean = false;
  selectedFilter : string[] = [];
  selectedDateFilter : DateFilter = { startDate: "", endDate: "" };

  startYear : number | undefined;
  endYear : number | undefined;
  startMonth : number | undefined;
  endMonth : number | undefined;
  startDay : number | undefined;
  endDay : number | undefined;

  SearchRecipes(){
    const subscription = this.recipeService.SearchInRecipes(this.paginationService.GetCurrentRecipePage(), this.searchString, this.selectedFilter.join(',') ,this.selectedDateFilter).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  ChangeFilterVisibility(){
    this.isFilterVisible = !this.isFilterVisible;
  }

  ChangeSelectedFilter($event : Event){
    const target = $event.target as HTMLInputElement;
    if(target.checked) {
      this.selectedFilter.push(target.value);
    } else{
      this.selectedFilter.splice(this.selectedFilter.indexOf(target.value), 1);
    }

    this.SearchRecipes();
  }

  RemoveDateFilterFromFilters(){
    this.startYear = undefined;
    this.endYear = undefined;
    this.startMonth = undefined;
    this.endMonth = undefined;
    this.startDay = undefined;
    this.endDay = undefined;

    this.selectedDateFilter = { startDate: "", endDate: "" };

    this.SearchRecipes();
  }

  AddDateFilterToFilters(){
    if(this.startYear && this.startMonth && this.startDay || this.endYear && this.endMonth && this.endDay){
      if(this.startYear && this.startMonth && this.startDay){
        const startDate = new Date(this.startYear, this.startMonth-1, this.startDay);
        this.selectedDateFilter.startDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
      }
      if(this.endYear && this.endMonth && this.endDay){
        const endDate = new Date(this.endYear, this.endMonth-1, this.endDay);
        this.selectedDateFilter.endDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`
      }

      this.SearchRecipes();
    } else{
      this.popupService.ShowPopup("Kérlek add meg legalább a kezdő vagy záró dátumot a keresés megkezdéséhez!", "warning");
    }
  }

  forceNumeric(event : Event) {
    const input = event.target as HTMLInputElement;

    const containsNonNumber = /[^0-9]/.test(input.value.toString());

    if(containsNonNumber){
      this.popupService.ShowPopup("A dátum csak számokat tartalmazhat", "warning");
    }
    input.value = input.value.replace(/\D/g, '')
  }
}
