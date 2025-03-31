import { Ingredient } from "./ingredient";

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
    uploadDateTime!: Date;
    state?: string;
    likeCount?: number;
    commentCount?: number;
    userHasLiked?: boolean;
    userHasFavorited?: boolean;
}