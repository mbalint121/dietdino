import { Recipe } from "../models/recipe";
import mysql from "mysql2/promise";
import dbConfig from "../app/config";

export default class RecipeService{
    static async GetAcceptedRecipes(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetAcceptedRecipes()");
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetWaitingRecipes(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetWaitingRecipes()");
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetDraftRecipes(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetDraftRecipes()");
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetRecipesByUserID(userID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetRecipesByUserID(?)", [userID]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetFavoriteRecipesByUserID(userID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetFavoriteRecipesByUserID(?)", [userID]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetRecipeStates(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetRecipeStates()");
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetRecipeByID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetRecipeByID(?)", [recipeID]);
            return rows[0][0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetIngredientsByRecipeID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetIngredientsByRecipeID(?)", [recipeID]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetCalorieValueByRecipeID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetCalorieValueByRecipeID(?) AS calorieValue", [recipeID]);
            return rows[0].calorieValue;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetUploaderIDByRecipeID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetUploaderIDByRecipeID(?) AS uploaderID", [recipeID]);
            return rows[0].uploaderID;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetLikeCountByRecipeID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetLikeCountByRecipeID(?) AS likeCount", [recipeID]);
            return rows[0].likeCount;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetCommentCountByRecipeID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetCommentCountByRecipeID(?) AS commentCount", [recipeID]);
            return rows[0].commentCount;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async NewRecipe(recipe: Recipe){
        const conn = await mysql.createConnection(dbConfig);
        
        conn.beginTransaction();
        try{
            const [rows]: any = await conn.query("CALL NewRecipe(?, ?, ?, ?, ?, ?)", [recipe.uploaderID, recipe.recipeName, recipe.image, recipe.preparationTime, recipe.preparationDescription, recipe.state?.stateName]);
            const insertID = rows[0][0].insertID;
            for(const ingredient of recipe.ingredients!){
                await conn.query("CALL NewIngredientByRecipeID(?, ?, ?, ?)", [insertID, ingredient.commodity?.commodityName, ingredient.measure?.measureName, ingredient.quantity]);
            }
            conn.commit();
            return rows[1];
        }
        catch(error){
            conn.rollback();
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async UpdateRecipe(recipe: Recipe){
        const conn = await mysql.createConnection(dbConfig);
        
        conn.beginTransaction();
        try{
            const [rows]: any = await conn.query("CALL UpdateRecipeByID(?, ?, ?, ?, ?, ?)", [recipe.ID, recipe.recipeName, recipe.image, recipe.preparationTime, recipe.preparationDescription, recipe.state?.stateName]);
            for(const ingredient of recipe.ingredients!){
                if(!ingredient.measure && !ingredient.quantity){
                    await conn.query("CALL DeleteIngredientByRecipeIDAndCommodityName(?, ?)", [recipe.ID, ingredient.commodity?.commodityName]);
                }
                else{
                    await conn.query("CALL AddOrUpdateIngredientByRecipeIDAndCommodityName(?, ?, ?, ?)", [recipe.ID, ingredient.commodity?.commodityName, ingredient.measure?.measureName, ingredient.quantity]);
                }
            }
            conn.commit();
            return rows;
        }
        catch(error){
            conn.rollback();
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async AcceptRecipeByID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL AcceptRecipeByID(?)", [recipeID]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async RecjectRecipeByID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL RejectRecipeByID(?)", [recipeID]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async DeleteRecipeByID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL DeleteRecipeByID(?)", [recipeID]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }
}