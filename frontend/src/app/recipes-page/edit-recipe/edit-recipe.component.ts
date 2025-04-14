import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { PageNavbarComponent } from "../../page-navbar/page-navbar.component";
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommodityService } from '../../services/commodity.service';
import { FormsModule } from '@angular/forms';
import { RecipeCommodityRowComponent } from "../recipe-commodity-row/recipe-commodity-row.component";
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../models/ingredient';
import { Recipe } from '../../models/recipe';
import { PopupService } from '../../popups/popup.service';
import { IngredientService } from '../../services/ingredient.service';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../services/image.service';
import ConfirmationDialogService from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [PageNavbarComponent, RecipeCommodityRowComponent, FormsModule, CommonModule],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.css'
})
export class EditRecipeComponent {
  recipeService : RecipeService = inject(RecipeService);
  route : ActivatedRoute = inject(ActivatedRoute);
  router : Router = inject(Router);
  commodityService : CommodityService = inject(CommodityService);
  popupService : PopupService = inject(PopupService);
  ingredientService : IngredientService = inject(IngredientService);
  imageService : ImageService = inject(ImageService);
  confirmationDialogService : ConfirmationDialogService = inject(ConfirmationDialogService);

  destroyRef : DestroyRef = inject(DestroyRef);

  recipe = signal<Recipe | null>(null);
  
  loading : boolean = true;
  selectedImageIsLoaded : boolean = false;
  fileCount: number = 0;

  recipeID : number | null= this.route.snapshot.url[0].path === "edit-recipe" ? Number.parseInt(this.route.snapshot.url[1].path) : null;
  recipeName : string = "";
  timeOfPreparationHours : number | null = null;
  timeOfPreparationMinutes : number | null = null;
  preparationDescription : string = "";
  image : string = "";
  state : string = "";

  imageFile : File | null = null;
  
  ngOnInit(){
    const subcription = this.commodityService.GetAllCommodities().subscribe()
    
    this.destroyRef.onDestroy(() => {
      subcription.unsubscribe();
    });
    
    if(this.recipeID == null){
      this.InitValues();
    } else{
      this.SetCurrentRecipe();
    }
  }
  
  ngOnDestroy() {
    localStorage.removeItem("recipeData");

    this.ResetValues();
  }

  @HostListener('window:beforeunload', ['$event'])
  handlebeforeUnload(event: Event) {
    if (event && event.type === 'beforeunload') {
      const recipeData = {
        recipeName: this.recipeName,
        timeOfPreparationHours: this.timeOfPreparationHours,
        timeOfPreparationMinutes: this.timeOfPreparationMinutes,
        preparationDescription: this.preparationDescription,
        image: this.image,
        ingredients: this.ingredientService.selectedIngredients(),
        state: this.state,
        fileCount: this.fileCount
      };
      localStorage.setItem("recipeData", JSON.stringify(recipeData));
    }
  }

  InitValues(){
    const storedRecipeData = JSON.parse(localStorage.getItem("recipeData")!);
    if(storedRecipeData){
      this.recipeName = storedRecipeData.recipeName;
      this.timeOfPreparationHours = storedRecipeData.timeOfPreparationHours;
      this.timeOfPreparationMinutes = storedRecipeData.timeOfPreparationMinutes;
      this.preparationDescription = storedRecipeData.preparationDescription;
      this.image = storedRecipeData.image;
      this.fileCount = storedRecipeData.fileCount;
      this.ingredientService.SetSelectedIngredients(storedRecipeData.ingredients as Ingredient[]);
      localStorage.removeItem("recipeData");
      this.loading = false;
    }
    else if(this.recipeID != null){
      const recipeData = this.recipe();
      if (recipeData?.ID != null) {
        this.recipeID = recipeData.ID!;
        this.recipeName = recipeData.recipeName!;
        this.timeOfPreparationHours = Number.parseInt(recipeData.preparationTime!.split(":")[0]);
        this.timeOfPreparationMinutes = Number.parseInt(recipeData.preparationTime!.split(":")[1]);
        this.preparationDescription = recipeData.preparationDescription!;
        this.image = recipeData.image!;
        this.ingredientService.SetSelectedIngredients(recipeData.ingredients!);
      }
      this.loading = false;
    }
    else{
      this.ResetValues();
    }
  }

  ResetValues(){
    this.recipeName = "";
    this.timeOfPreparationHours = null;
    this.timeOfPreparationMinutes = null;
    this.preparationDescription = "";
    this.image = "";
    this.ingredientService.SetSelectedIngredients([]);
    this.state = "";
    this.loading = false;
  }
  
  GetCurrentRecipe(){
    return this.recipeService.GetRecipeById(this.recipeID!);
  }

  SetCurrentRecipe(){
    const subscription = this.GetCurrentRecipe().subscribe((response : any) => {
      this.recipe.set(response.recipe);
      this.InitValues();
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }


  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.fileCount = files.length;
      
      if(this.fileCount > 1){
        this.fileCount = 0;
        this.popupService.ShowPopup("Egy recepthez csak egy kép tölthető fel.", "error");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
        this.selectedImageIsLoaded = true;
      };
      reader.readAsDataURL(files[0]);
      
      this.imageFile = files[0];
    }
  }

  AddIngredient(){
    this.ingredientService.SetSelectedIngredients([...this.ingredientService.GetSelectedIngredients(), { commodity: "Burgonya", measure: "milligramm", quantity: 0 }]);
  }

  hasDuplicateCommodity(ingredients: Ingredient[]): boolean {
    const uniqueCommodities = new Set(ingredients.map(ingredient => ingredient.commodity));
    return uniqueCommodities.size < ingredients.length;
  }

  CheckIfRecipeDataIsOkay(){
    if(this.recipeName === ""){
      this.popupService.ShowPopup("Recept nevének megadása kötelező", "error");
      return false;
    }
    else if((this.timeOfPreparationHours == null || this.timeOfPreparationHours < 0 || this.timeOfPreparationHours > 23 || this.timeOfPreparationHours.toString() == "") || (this.timeOfPreparationMinutes == null || this.timeOfPreparationMinutes < 0 || this.timeOfPreparationMinutes > 59 || this.timeOfPreparationMinutes.toString() == "")){
      this.popupService.ShowPopup("Elkészítési idő megadása kötelező", "error");
      return false;
    }
    else if(this.timeOfPreparationHours == 0 && this.timeOfPreparationMinutes == 0){
      this.popupService.ShowPopup("Elkészítési idő nem lehet 0 óra 0 perc", "error");
      return false;
    }
    else if(isNaN(this.timeOfPreparationHours!) || isNaN(this.timeOfPreparationMinutes!)){
      this.popupService.ShowPopup("Elkészítési idő csak szám lehet", "error");
      return false;
    }
    else if(this.ingredientService.selectedIngredients()?.length === 0){
      this.popupService.ShowPopup("Hozzávalók megadása kötelező", "error");
      return false;
    }
    else if(this.hasDuplicateCommodity(this.ingredientService.selectedIngredients()!)){
      this.popupService.ShowPopup("Hozzávalók között nem lehet két ugyanolyan", "error");
      return false;
    }
    else if(this.ingredientService.selectedIngredients()?.some(ingredient => ingredient.quantity === 0)){
      this.popupService.ShowPopup("Hozzávalók mennyiségének megadása kötelező", "error");
      return false;
    }
    else if(this.ingredientService.selectedIngredients()?.some(ingredient => isNaN(ingredient.quantity!))){
      this.popupService.ShowPopup("Hozzávalók mennyisége csak szám lehet", "error");
      return false;
    }
    if(this.preparationDescription === ""){
      this.popupService.ShowPopup("Elkészítési leírás megadása kötelező", "error");
      return false;
    }
    else if(this.image === ""){
      this.popupService.ShowPopup("Kép feltöltése kötelező", "error");
      return false;
    }
    else{
      return true;
    }
  }

  NewDraftRecipe(){
    this.state = "Draft";

    this.NewRecipe();
  }

  NewWaitingRecipe(){
    this.state = "Waiting";

    this.NewRecipe();
  }

  NewRecipe(){
    console.log(this.timeOfPreparationHours, this.timeOfPreparationMinutes);
    if(!this.CheckIfRecipeDataIsOkay()){
      return;
    }

    const recipe: Recipe = new Recipe();
    recipe.recipeName = this.recipeName;
    recipe.preparationTime = this.timeOfPreparationHours!.toString().padStart(2, "0") + ":" + this.timeOfPreparationMinutes!.toString().padStart(2, "0") + ":00";
    recipe.preparationDescription = this.preparationDescription;
    recipe.state = this.state;
    recipe.ingredients = this.ingredientService.selectedIngredients()!;

    if(this.route.snapshot.url[0].path === "edit-recipe"){
      recipe.ID = this.recipeID!;
      const updateSubscription = this.recipeService.UpdateRecipeByID(recipe).subscribe(response => {
        const imageUploadSubscription = this.imageService.UploadImage(this.recipeID!, this.imageFile!, response)?.subscribe();
          
        this.destroyRef.onDestroy(() => {
          imageUploadSubscription?.unsubscribe();
        });
      });

      this.destroyRef.onDestroy(() => {
        updateSubscription.unsubscribe();
      });
    } else{
      const subcription = this.recipeService.NewRecipe(recipe).subscribe(response => {
        const imageUploadSubcription = this.imageService.UploadImage(response.recipeID, this.imageFile!, response)?.subscribe(); 

        this.destroyRef.onDestroy(() => {
          imageUploadSubcription?.unsubscribe();
        });
      });

      this.destroyRef.onDestroy(() => {
        subcription.unsubscribe();
      });
    }
  }

  Cancel(){
    let confirmationDialogServiceSubscription : any;
    if(this.route.snapshot.url[0].path === "edit-recipe"){
      confirmationDialogServiceSubscription = this.confirmationDialogService.OpenDialog("Biztosan félbe szeretnéd hagyni a recept szerkesztését?").subscribe(result => {
        if(result == "ok"){
          this.router.navigate(["/recipe", this.recipeID]);
        }
      });

      this.destroyRef.onDestroy(() => {
        confirmationDialogServiceSubscription.unsubscribe();
      });
    } else if(this.route.snapshot.url[0].path === "upload-recipe"){
      confirmationDialogServiceSubscription = this.confirmationDialogService.OpenDialog("Biztosan félbe szeretnéd hagyni az új recept feltöltését?").subscribe(result => {
        if(result == "ok"){
          this.router.navigate(["/my-recipes"]);
        }
      });

      this.destroyRef.onDestroy(() => {
        confirmationDialogServiceSubscription.unsubscribe();
      });
    }
  }
}
