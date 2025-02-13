import RecipeService from "../services/recipe";
import CommodityService from "../services/commodity";
import { Request, Response } from "express";
import { Recipe } from "../models/recipe";
import { Ingredient } from "../models/ingredient";
import { Commodity } from "../models/commodity";
import { Measure } from "../models/measure";
import { RecipeState } from "../models/recipestate";

export async function GetAcceptedRecipes(req: Request, res: Response){
    const recipes: Array<Recipe> = await RecipeService.GetAcceptedRecipes()
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    for(const recipe of recipes){
        recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });
    }

    res.status(200).send({recipes: recipes});
    return;
}

export async function GetWaitingRecipes(req: Request, res: Response){
    const recipes: Array<Recipe> = await RecipeService.GetWaitingRecipes()
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    for(const recipe of recipes){
        recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });
    }

    res.status(200).send({recipes: recipes});
    return;
}

export async function GetDraftRecipesByUser(req: any, res: Response){
    const recipes: Array<Recipe> = await RecipeService.GetDraftRecipesByUserID(req.decodedToken.userID)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    for(const recipe of recipes){
        recipe.ingredients = await RecipeService.GetIngredientsByRecipeID(recipe.ID!)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        recipe.calorieValue = await RecipeService.GetCalorieValueByRecipeID(recipe.ID!)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });
    }

    res.status(200).send({recipes: recipes});
    return;
}

export async function NewRecipe(req: any, res: Response){
    const recipe: Recipe = new Recipe();
    recipe.uploaderID = req.decodedToken.userID;
    Object.assign(recipe, req.body);
    
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

    const state: RecipeState = new RecipeState();
    state.stateName = recipe.state as string;
    recipe.state = state;

    if(!recipe.recipeName || !recipe.image || !recipe.ingredients || !recipe.preparationTime || !recipe.preparationDescription || !recipe.state){
        res.status(400).send({error: "Hiányzó adatok"});
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

        ingredient.commodity.usableMeasures = await CommodityService.GetUsableMeasuresByCommodityName(ingredient.commodity.commodityName)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(!ingredient.commodity.usableMeasures || ingredient.commodity.usableMeasures?.length == 0){
            res.status(400).send({error: "Nem létezik ilyen hozzávaló"});
            return;
        }

        if(!ingredient.commodity.usableMeasures.some(usableMeasure => usableMeasure.measureName == ingredient.measure?.measureName)){
            res.status(400).send({error: "Nem használható mértékegység"});
            return;
        }
    }

    const regex = /^\d\d:\d\d:\d\d$/;
    if(!regex.test(recipe.preparationTime)){
        res.status(400).send({error: "Nem megfelelő az elkészítési idő formátuma"});
        return;
    }

    const recipeStates: Array<RecipeState> = await RecipeService.GetRecipeStates()
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!recipeStates.some(recipeState => recipeState.stateName == recipe.state?.stateName)){
        res.status(400).send({error: "Nem létezik ilyen recept státusz"});
        return;
    }

    if(recipe.state.stateName != "Draft" && recipe.state.stateName != "Waiting"){
        res.status(400).send({error: "Csak piszkozat vagy várakozó státuszú lehet a recept"});
        return;
    }

    await RecipeService.NewRecipe(recipe)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a recept feltöltése során"});
            return;
        }
        res.status(200).send({message: "Recept sikeresen feltölteve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function UpdateRecipeByID(req: any, res: Response){
    const oldRecipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    oldRecipe.ingredients = await RecipeService.GetIngredientsByRecipeID(oldRecipe.ID!)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    const recipe: Recipe = new Recipe();
    Object.assign(recipe, oldRecipe);
    Object.assign(recipe, req.body);

    const regex = /^\d\d:\d\d:\d\d$/;
    if(!regex.test(recipe.preparationTime!)){
        res.status(400).send({error: "Nem megfelelő az elkészítési idő formátuma"});
        return;
    }

    if(oldRecipe.recipeName == recipe.recipeName && oldRecipe.image == recipe.image && JSON.stringify(oldRecipe.ingredients) == JSON.stringify(recipe.ingredients) && oldRecipe.preparationTime == recipe.preparationTime && oldRecipe.preparationDescription == recipe.preparationDescription){
        res.status(400).send({error: "Nem történt módosítás"});
        return;
    }

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

        ingredient.commodity.usableMeasures = await CommodityService.GetUsableMeasuresByCommodityName(ingredient.commodity.commodityName)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(!ingredient.commodity.usableMeasures || ingredient.commodity.usableMeasures?.length == 0){
            res.status(400).send({error: "Nem létezik ilyen hozzávaló"});
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

    await RecipeService.UpdateRecipe(recipe)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a recept módosítása során"});
            return;
        }
        res.status(200).send({message: "Recept sikeresen módosítva"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function AcceptRecipeByID(req: any, res: Response){
    const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

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
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function RejectRecipeByID(req: any, res: Response){
    const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

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
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function DeleteRecipeByID(req: any, res: Response){
    const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!recipe){
        res.status(400).send({error: "Nem létezik ilyen recept"});
        return;
    }

    await RecipeService.DeleteRecipeByID(req.params.ID)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a recept törlése során"});
            return;
        }
        res.status(200).send({message: "Recept sikeresen törölve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}