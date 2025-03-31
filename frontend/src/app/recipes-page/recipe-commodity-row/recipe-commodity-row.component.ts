import { Component, effect, inject, Input, signal, runInInjectionContext, Injector, untracked } from '@angular/core';
import { CommodityService } from '../../services/commodity.service';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-recipe-commodity-row',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recipe-commodity-row.component.html',
  styleUrl: './recipe-commodity-row.component.css'
})
export class RecipeCommodityRowComponent{
  @Input() rowId! : number;
  recipeService : RecipeService = inject(RecipeService);
  ingredientService : IngredientService = inject(IngredientService);
  commodityService : CommodityService = inject(CommodityService);

  selectedCommmodity = signal<string>("");
  quantity = signal<number>(0);
  selectedMeasure = signal<string>("");

  constructor(){
    effect(() => {
      let currentIngredient = {commodity: this.selectedCommmodity(), quantity: this.quantity(), measure: this.selectedMeasure()};

      untracked(() => {
        this.ingredientService.UpdateSelectedIngredients(this.rowId, currentIngredient);
        this.ingredientService.SetIdForSelectedIngredients();
      });
    }, {allowSignalWrites: true});
  }

  ngOnInit(){
    this.InitValues();
  }

  InitValues(){
    const commodities = this.commodityService.GetCommodities();
    if(this.ingredientService.selectedIngredients() && this.ingredientService.selectedIngredients()![this.rowId]){
      this.selectedCommmodity.set(this.ingredientService.selectedIngredients()![this.rowId].commodity!);
      this.quantity.set(this.ingredientService.selectedIngredients()![this.rowId].quantity!);
      this.selectedMeasure.set(this.ingredientService.selectedIngredients()![this.rowId].measure!);
    }
    else if (commodities && commodities.length > 0) {
      this.selectedCommmodity.set(commodities[0].commodityName!);
      this.selectedMeasure.set(this.GetMeasures()[0].measureName!);
    }
  }

  GetMeasures(){
    const commodity = this.commodityService.GetCommodities()?.find(c => c.commodityName === this.selectedCommmodity());
    if (commodity) {
      return this.commodityService.GetUsableMeasuresForCommodities(commodity);
    }
    return [];
  }

  OnCommodityChange(){
    this.selectedMeasure.set(this.GetMeasures()[0].measureName!);
  }

  DeleteIngredient() {
    this.ingredientService.selectedIngredients.set(this.ingredientService.GetSelectedIngredients().filter(ingredient => ingredient.id != this.ingredientService.GetSelectedIngredients()[this.rowId].id));

    setTimeout(() => {
      this.ingredientService.SetIdForSelectedIngredients();
    }, 0);
  }
}
