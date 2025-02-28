import { Ingredient } from "./ingredient";
import { RecipeState } from "./recipestate";

export class Recipe{
    ID?: number;
    uploaderID?: number;
    uploader?: string;
    recipeName?: string;
    image?: string;
    ingredients?: Array<Ingredient>;
    preparationTime?: string;
    preparationDescription?: string;
    calorieValue?: number;
    uploadDateTime?: Date;
    state?: RecipeState;
    likeCount?: number;
    commentCount?: number;
    userHasLiked?: boolean;
    userHasFavorited?: boolean;
}