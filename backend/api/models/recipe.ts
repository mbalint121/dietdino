import { Ingredient } from "./ingredient";
import { RecipeState } from "./recipestate";

export class Recipe{
    ID?: number;
    uploaderID?: number;
    recipeName?: string;
    image?: string;
    ingredients?: Array<Ingredient>;
    preparationTime?: string;
    preparationDescription?: string;
    calorieValue?: number;
    uploadDateTime?: Date;
    likeCount?: number;
    state?: RecipeState;
}