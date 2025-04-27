import { Request, Response } from "express";
import { Recipe } from "../models/recipe";
import RecipeService from "../services/recipe";
import { Commodity } from "../models/commodity";
import CommodityService from "../services/commodity";
import { Ingredient } from "../models/ingredient";
import { Measure } from "../models/measure";
import { RecipeState } from "../models/recipestate";
import { Like } from "../models/like";
import LikeService from "../services/like";
import { Favorite } from "../models/favorite";
import FavoriteService from "../services/favorite";
import UserService from "../services/user";
import { IsRecipeNameValid, IsPreparationTimeValid, IsPreparationDescriptionValid } from "../validators/regex";
import { PaginationParameters } from "../models/paginationParameters";
import { QueryParameters } from "../models/queryParameters";

export async function GetHotRecipes(req: any, res: Response){
    try{
        const recipes: Array<Recipe> = await RecipeService.GetHotRecipes();

        for(const recipe of recipes){
            recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
            recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
            recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
            recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
        }
    
        res.status(200).send({recipes: recipes});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetFreshRecipes(req: any, res: Response){
    try{
        const recipes: Array<Recipe> = await RecipeService.GetFreshRecipes();

        for(const recipe of recipes){
            recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
            recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
            recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
            recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
        }
    
        res.status(200).send({recipes: recipes});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetAcceptedRecipes(req: any, res: Response){
    try{
        const paginationParameters: PaginationParameters = req.paginationParameters;

        const queryParameters: QueryParameters = req.queryParameters;

        const recipeCount: number = await RecipeService.GetAcceptedRecipeCount(queryParameters);
        const totalPageCount: number = Math.ceil(recipeCount / paginationParameters.limit!);

        const recipes: Array<Recipe> = await RecipeService.GetAcceptedRecipesPaginated(paginationParameters, queryParameters);
    
        for(const recipe of recipes){
            recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
            recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
            recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
            recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
    
            const like: Like = new Like();
            like.userID = req.decodedToken.userID;
            like.recipeID = recipe.ID;
    
            const likeExists: Like = await LikeService.GetLike(like);
    
            if(likeExists){
                recipe.userHasLiked = true;
            }
            else{
                recipe.userHasLiked = false;
            }
    
            const favorite: Favorite = new Favorite();
            favorite.userID = req.decodedToken.userID;
            favorite.recipeID = recipe.ID;
    
            const favoriteExists: Favorite = await FavoriteService.GetFavorite(favorite);
    
            if(favoriteExists){
                recipe.userHasFavorited = true;
            }
            else{
                recipe.userHasFavorited = false;
            }
        }
    
        res.status(200).send({recipes: recipes, totalPageCount: totalPageCount});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetWaitingRecipes(req: any, res: Response){
    try{
        const paginationParameters: PaginationParameters = req.paginationParameters;

        const recipeCount: number = await RecipeService.GetWaitingRecipeCount();
        const totalPageCount: number = Math.ceil(recipeCount / paginationParameters.limit!);

        const recipes: Array<Recipe> = await RecipeService.GetWaitingRecipesPaginated(paginationParameters);
    
        for(const recipe of recipes){
            recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
            recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
            recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
            recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
    
            const like: Like = new Like();
            like.userID = req.decodedToken.userID;
            like.recipeID = recipe.ID;
    
            const likeExists: Like = await LikeService.GetLike(like);
    
            if(likeExists){
                recipe.userHasLiked = true;
            }
            else{
                recipe.userHasLiked = false;
            }
    
            const favorite: Favorite = new Favorite();
            favorite.userID = req.decodedToken.userID;
            favorite.recipeID = recipe.ID;
    
            const favoriteExists: Favorite = await FavoriteService.GetFavorite(favorite);
    
            if(favoriteExists){
                recipe.userHasFavorited = true;
            }
            else{
                recipe.userHasFavorited = false;
            }
        }
    
        res.status(200).send({recipes: recipes, totalPageCount: totalPageCount});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetDraftRecipes(req: any, res: Response){
    try{
        const paginationParameters: PaginationParameters = req.paginationParameters;

        const recipeCount: number = await RecipeService.GetDraftRecipeCount();
        const totalPageCount: number = Math.ceil(recipeCount / paginationParameters.limit!);

        const recipes: Array<Recipe> = await RecipeService.GetDraftRecipesPaginated(paginationParameters);
    
        for(const recipe of recipes){
            recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
            recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
            recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
            recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
    
            const like: Like = new Like();
            like.userID = req.decodedToken.userID;
            like.recipeID = recipe.ID;
    
            const likeExists: Like = await LikeService.GetLike(like);
    
            if(likeExists){
                recipe.userHasLiked = true;
            }
            else{
                recipe.userHasLiked = false;
            }
    
            const favorite: Favorite = new Favorite();
            favorite.userID = req.decodedToken.userID;
            favorite.recipeID = recipe.ID;
    
            const favoriteExists: Favorite = await FavoriteService.GetFavorite(favorite);
    
            if(favoriteExists){
                recipe.userHasFavorited = true;
            }
            else{
                recipe.userHasFavorited = false;
            }
        }
    
        res.status(200).send({recipes: recipes, totalPageCount: totalPageCount});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetRecipesByUserSelf(req: any, res: Response){
    try{
        const paginationParameters: PaginationParameters = req.paginationParameters;
        const queryParameters: QueryParameters = req.queryParameters;

        const recipeCount: number = await RecipeService.GetRecipeCountByUserID(req.decodedToken.userID, queryParameters);
        const totalPageCount: number = Math.ceil(recipeCount / paginationParameters.limit!);

        const recipes: Array<Recipe> = await RecipeService.GetRecipesByUserIDPaginated(req.decodedToken.userID, paginationParameters, queryParameters);
    
        for(const recipe of recipes){
            recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
            recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
            recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
            recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
    
            const like: Like = new Like();
            like.userID = req.decodedToken.userID;
            like.recipeID = recipe.ID;
    
            const likeExists: Like = await LikeService.GetLike(like);
    
            if(likeExists){
                recipe.userHasLiked = true;
            }
            else{
                recipe.userHasLiked = false;
            }
    
            const favorite: Favorite = new Favorite();
            favorite.userID = req.decodedToken.userID;
            favorite.recipeID = recipe.ID;
    
            const favoriteExists: Favorite = await FavoriteService.GetFavorite(favorite);
    
            if(favoriteExists){
                recipe.userHasFavorited = true;
            }
            else{
                recipe.userHasFavorited = false;
            }
        }
    
        res.status(200).send({recipes: recipes, totalPageCount: totalPageCount});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetFavoriteRecipesByUser(req: any, res: Response){
    try{
        const paginationParameters: PaginationParameters = req.paginationParameters;
        const queryParameters: QueryParameters = req.queryParameters;

        const recipeCount: number = await RecipeService.GetAcceptedFavoriteRecipeCountByUserID(req.decodedToken.userID, queryParameters);
        const totalPageCount: number = Math.ceil(recipeCount / paginationParameters.limit!);

        const recipes: Array<Recipe> = await RecipeService.GetAcceptedFavoriteRecipesByUserIDPaginated(req.decodedToken.userID, paginationParameters, queryParameters);
    
        for(const recipe of recipes){
            recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
            recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
            recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
            recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
    
            const like: Like = new Like();
            like.userID = req.decodedToken.userID;
            like.recipeID = recipe.ID;
    
            const likeExists: Like = await LikeService.GetLike(like);
    
            if(likeExists){
                recipe.userHasLiked = true;
            }
            else{
                recipe.userHasLiked = false;
            }
    
            const favorite: Favorite = new Favorite();
            favorite.userID = req.decodedToken.userID;
            favorite.recipeID = recipe.ID;
    
            const favoriteExists: Favorite = await FavoriteService.GetFavorite(favorite);
    
            if(favoriteExists){
                recipe.userHasFavorited = true;
            }
            else{
                recipe.userHasFavorited = false;
            }
        }
    
        res.status(200).send({recipes: recipes, totalPageCount: totalPageCount});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetRecipesByUser(req: any, res: Response){
    try{
        const paginationParameters: PaginationParameters = req.paginationParameters;
        const queryParameters: QueryParameters = req.queryParameters;

        const recipeCount: number = await RecipeService.GetAcceptedRecipeCountByUsername(req.params.username, queryParameters);
        const totalPageCount: number = Math.ceil(recipeCount / paginationParameters.limit!);
    
        const recipes: Array<Recipe> = await RecipeService.GetAcceptedRecipesByUsernamePaginated(req.params.username, paginationParameters, queryParameters);
    
        for(const recipe of recipes){
            recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
            recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
            recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
            recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
    
            const like: Like = new Like();
            like.userID = req.decodedToken.userID;
            like.recipeID = recipe.ID;
    
            const likeExists: Like = await LikeService.GetLike(like);
    
            if(likeExists){
                recipe.userHasLiked = true;
            }
            else{
                recipe.userHasLiked = false;
            }
    
            const favorite: Favorite = new Favorite();
            favorite.userID = req.decodedToken.userID;
            favorite.recipeID = recipe.ID;
    
            const favoriteExists: Favorite = await FavoriteService.GetFavorite(favorite);
    
            if(favoriteExists){
                recipe.userHasFavorited = true;
            }
            else{
                recipe.userHasFavorited = false;
            }
        }
    
        res.status(200).send({recipes: recipes, totalPageCount: totalPageCount});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetRecipeByID(req: any, res: Response){
    try{
        const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID);
    
        if(!recipe){
            res.status(404).send({error: "Nem létezik ilyen recept"});
            return;
        }

        recipe.uploaderID = await RecipeService.GetUploaderIDByRecipeID(recipe.ID!);

        if(req.decodedToken.userID != recipe.uploaderID){
            const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID);
        
            if((recipe.state as string) == "Draft" && userRole != "Admin"){
                res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
        
            if((recipe.state as string) == "Waiting" && userRole != "Admin" && userRole != "Moderator"){
                res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
        }

        recipe.uploaderID = undefined;
    
        recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!);
    
        recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!);
    
        recipe.likeCount = await RecipeService.GetLikeCountByRecipeID(recipe.ID!);
    
        recipe.commentCount = await RecipeService.GetCommentCountByRecipeID(recipe.ID!);
    
        const like: Like = new Like();
        like.userID = req.decodedToken.userID;
        like.recipeID = recipe.ID;
    
        const likeExists: Like = await LikeService.GetLike(like);
    
        if(likeExists){
            recipe.userHasLiked = true;
        }
        else{
            recipe.userHasLiked = false;
        }
    
        const favorite: Favorite = new Favorite();
        favorite.userID = req.decodedToken.userID;
        favorite.recipeID = recipe.ID;
    
        const favoriteExists: Favorite = await FavoriteService.GetFavorite(favorite);
    
        if(favoriteExists){
            recipe.userHasFavorited = true;
        }
        else{
            recipe.userHasFavorited = false;
        }
    
        res.status(200).send({recipe: recipe});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function NewRecipe(req: any, res: Response){
    try{
        const recipe: Recipe = new Recipe();
        Object.assign(recipe, req.body);
        recipe.uploaderID = req.decodedToken.userID;
        
        const ingredients: Array<Ingredient> = new Array<Ingredient>();
        for(const ingredient of req.body.ingredients){
            const commodity: Commodity = new Commodity();
            commodity.commodityName = ingredient.commodity;
    
            const measure: Measure = new Measure();
            measure.measureName = ingredient.measure;
    
            const newIngredient: Ingredient = new Ingredient();
            Object.assign(newIngredient, ingredient);
            newIngredient.commodity = commodity;
            newIngredient.measure = measure;
            ingredients.push(newIngredient);
        }
        recipe.ingredients = ingredients;
    
        if(!recipe.recipeName || !recipe.ingredients || !recipe.preparationTime || !recipe.preparationDescription || !recipe.state){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }
    
        if(!IsRecipeNameValid(recipe.recipeName)){
            res.status(400).send({error: "Nem megfelelő a recept nevének formátuma"});
            return;
        }

        if(!IsPreparationTimeValid(recipe.preparationTime)){
            res.status(400).send({error: "Nem megfelelő az elkészítési idő formátuma"});
            return;
        }
    
        if(!IsPreparationDescriptionValid(recipe.preparationDescription)){
            res.status(400).send({error: "Nem megfelelő a elkészítés leírásának formátuma"});
            return;
        }
    
        if(recipe.ingredients.length == 0){
            res.status(400).send({error: "Legalább 1 hozzávaló szükséges"});
            return;
        }
    
        for(const ingredient of recipe.ingredients){
            if(!ingredient.commodity || !ingredient.commodity.commodityName || !ingredient.measure || !ingredient.measure.measureName || ingredient.quantity == undefined){
                res.status(400).send({error: "Hiányzó adatok"});
                return;
            }
    
            if(ingredient.quantity <= 0){
                res.status(400).send({error: "A mennyiség csak poitív szám lehet"});
                return;
            }
    
            for(const otherIngredient of recipe.ingredients){
                if(ingredient != otherIngredient && ingredient.commodity.commodityName == otherIngredient.commodity?.commodityName){
                    res.status(400).send({error: "Nem lehet két azonos nevű hozzávaló"});
                    return;
                }
            }
    
            ingredient.commodity.usableMeasures = await CommodityService.GetUsableMeasuresByCommodityName(ingredient.commodity.commodityName);
            
            if(!ingredient.commodity.usableMeasures || ingredient.commodity.usableMeasures?.length == 0){
                res.status(404).send({error: "Nem létezik ilyen hozzávaló"});
                return;
            }
            
            if(!ingredient.commodity.usableMeasures.some(usableMeasure => usableMeasure.measureName == ingredient.measure?.measureName)){
                res.status(400).send({error: "Nem használható mértékegység"});
                return;
            }
        }
        
        const state: RecipeState = new RecipeState();
        state.stateName = recipe.state as string;
        recipe.state = state;
    
        const recipeStates: Array<RecipeState> = await RecipeService.GetRecipeStates();
    
        if(!recipeStates.some(recipeState => recipeState.stateName == recipe.state?.stateName)){
            res.status(404).send({error: "Nem létezik ilyen recept státusz"});
            return;
        }
    
        if(recipe.state.stateName != "Draft" && recipe.state.stateName != "Waiting"){
            res.status(400).send({error: "Csak piszkozat vagy várakozó státuszú lehet a recept"});
            return;
        }
    
        await RecipeService.NewRecipe(recipe)
        .then(async (insertID) => {
            if(!insertID){
                res.status(500).send({error: "Hiba a recept feltöltése során"});
                return;
            }
            res.status(201).send({message: "Recept sikeresen feltöltve", recipeID: insertID});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function UpdateRecipeByID(req: any, res: Response){
    try{
        const oldRecipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID);
    
        if(!oldRecipe){
            res.status(404).send({error: "Nem létezik ilyen recept"});
            return;
        }
    
        oldRecipe.ingredients = await RecipeService.GetIngredientsByRecipeID(oldRecipe.ID!);
    
        const recipe: Recipe = new Recipe();
        Object.assign(recipe, oldRecipe);
        Object.assign(recipe, req.body);
    
        if(oldRecipe.recipeName == recipe.recipeName && JSON.stringify(oldRecipe.ingredients) == JSON.stringify(recipe.ingredients) && oldRecipe.preparationTime == recipe.preparationTime && oldRecipe.preparationDescription == recipe.preparationDescription && oldRecipe.state == recipe.state){
            res.status(400).send({error: "Nem történt módosítás"});
            return;
        }
    
        if(!IsRecipeNameValid(recipe.recipeName!)){
            res.status(400).send({error: "Nem megfelelő a recept nevének formátuma"});
            return;
        }
    
        if(!IsPreparationTimeValid(recipe.preparationTime!)){
            res.status(400).send({error: "Nem megfelelő az elkészítési idő formátuma"});
            return;
        }
    
        if(!IsPreparationDescriptionValid(recipe.preparationDescription!)){
            res.status(400).send({error: "Nem megfelelő a elkészítés leírásának formátuma"});
            return;
        }

        if(req.body.ingredients){
            const ingredients: Array<Ingredient> = new Array<Ingredient>();
            for(const ingredient of req.body.ingredients){
                const commodity: Commodity = new Commodity();
                commodity.commodityName = ingredient.commodity;
        
                const measure: Measure = new Measure();
                measure.measureName = ingredient.measure;
        
                const newIngredient: Ingredient = new Ingredient();
                Object.assign(newIngredient, ingredient);
                newIngredient.commodity = commodity;
                newIngredient.measure = measure;
                ingredients.push(newIngredient);
            }
            recipe.ingredients = ingredients;
        
            if(recipe.ingredients.length == 0){
                res.status(400).send({error: "Legalább 1 hozzávaló szükséges"});
                return;
            }
        
            for(const ingredient of recipe.ingredients){
                if(!ingredient.commodity || !ingredient.commodity.commodityName || !ingredient.measure || !ingredient.measure.measureName || ingredient.quantity == undefined){
                    res.status(400).send({error: "Hiányzó adatok"});
                    return;
                }
        
                if(ingredient.quantity <= 0){
                    res.status(400).send({error: "A mennyiség csak poitív szám lehet"});
                    return;
                }
        
                for(const otherIngredient of recipe.ingredients){
                    if(ingredient != otherIngredient && ingredient.commodity.commodityName.toLowerCase() == otherIngredient.commodity?.commodityName?.toLowerCase()){
                        res.status(400).send({error: "Nem lehet két azonos nevű hozzávaló"});
                        return;
                    }
                }
        
                ingredient.commodity.usableMeasures = await CommodityService.GetUsableMeasuresByCommodityName(ingredient.commodity.commodityName);
        
                if(!ingredient.commodity.usableMeasures || ingredient.commodity.usableMeasures?.length == 0){
                    res.status(404).send({error: "Nem létezik ilyen hozzávaló"});
                    return;
                }
        
                if(!ingredient.commodity.usableMeasures.some(usableMeasure => usableMeasure.measureName == ingredient.measure?.measureName)){
                    res.status(400).send({error: "Nem használható mértékegység"});
                    return;
                }
            }
        
            for(const oldIngredient of oldRecipe.ingredients!){
                if(!recipe.ingredients.some(ingredient => ingredient.commodity?.commodityName == oldIngredient.commodity)){
                    const ingredientToDelete: Ingredient = new Ingredient();
                    ingredientToDelete.commodity = new Commodity();
                    ingredientToDelete.commodity.commodityName = oldIngredient.commodity as string;
                    recipe.ingredients.push(ingredientToDelete);
                }
            }
        }
        else{
            recipe.ingredients = undefined;
        }
    
        const state: RecipeState = new RecipeState();
        if(!req.body.state && (recipe.state as string) == "Accepted"){
            state.stateName = "Waiting";
        }
        else{
            state.stateName = recipe.state as string;
        }
        recipe.state = state;
    
        const recipeStates: Array<RecipeState> = await RecipeService.GetRecipeStates();
    
        if(!recipeStates.some(recipeState => recipeState.stateName == recipe.state?.stateName)){
            res.status(404).send({error: "Nem létezik ilyen recept státusz"});
            return;
        }
    
        if(recipe.state.stateName != "Draft" && recipe.state.stateName != "Waiting"){
            res.status(400).send({error: "Csak piszkozat vagy várakozó státuszú lehet a recept"});
            return;
        }
    
        await RecipeService.UpdateRecipe(recipe)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a recept módosítása során"});
                return;
            }
            res.status(200).send({message: "Recept sikeresen módosítva"});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function AcceptRecipeByID(req: any, res: Response){
    try{
        const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID);
    
        if(!recipe){
            res.status(404).send({error: "Nem létezik ilyen recept"});
            return;
        }
    
        const state: RecipeState = new RecipeState();
        state.stateName = recipe.state as string;
        recipe.state = state;
    
        if(recipe.state?.stateName != "Waiting"){
            res.status(400).send({error: "Csak várakozó receptet lehet elfogadni"});
            return;
        }
    
        await RecipeService.AcceptRecipeByID(req.params.ID)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a recept elfogadása során"});
                return;
            }
            res.status(200).send({message: "Recept sikeresen elfogadva"});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function RejectRecipeByID(req: any, res: Response){
    try{
        const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID);
    
        if(!recipe){
            res.status(404).send({error: "Nem létezik ilyen recept"});
            return;
        }
    
        const state: RecipeState = new RecipeState();
        state.stateName = recipe.state as string;
        recipe.state = state;
        
        if(recipe.state?.stateName != "Waiting"){
            res.status(400).send({error: "Csak várakozó receptet lehet elutasítani"});
            return;
        }
    
        await RecipeService.RecjectRecipeByID(req.params.ID)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a recept elutasítása során"});
                return;
            }
            res.status(200).send({message: "Recept sikeresen elutasítva"});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function DeleteRecipeByID(req: any, res: Response){
    try{
        const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID);
    
        if(!recipe){
            res.status(404).send({error: "Nem létezik ilyen recept"});
            return;
        }
    
        await RecipeService.DeleteRecipeByID(req.params.ID)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a recept törlése során"});
                return;
            }
            res.status(200).send({message: "Recept sikeresen törölve"});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}