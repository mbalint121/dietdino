import { Recipe } from "../models/recipe";
import mysql from "mysql2/promise";
import dbConfig from "../app/config";
import ImageService from "./image";
import { PaginationParameters } from "../models/paginationParameters";
import { QueryParameters } from "../models/queryParameters";

export default class RecipeService{
    static async GetAcceptedRecipeCount(queryParameters: QueryParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetAcceptedRecipeCount(?, ?, ?) AS count", [queryParameters.search, queryParameters.startDate, queryParameters.endDate]);
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetAcceptedRecipesPaginated(paginationParameters: PaginationParameters, queryParameters: QueryParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetAcceptedRecipesPaginated(?, ?, ?, ?, ?)", [paginationParameters.page, paginationParameters.limit, queryParameters.search, queryParameters.startDate, queryParameters.endDate]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetWaitingRecipeCount(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetWaitingRecipeCount() as count");
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetWaitingRecipesPaginated(paginationParameters: PaginationParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetWaitingRecipesPaginated(?, ?)", [paginationParameters.page, paginationParameters.limit]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetDraftRecipeCount(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetDraftRecipeCount() as count");
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetDraftRecipesPaginated(paginationParameters: PaginationParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetDraftRecipesPaginated(?, ?)", [paginationParameters.page, paginationParameters.limit]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetRecipeCountByUserID(userID: number, queryParameters: QueryParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetRecipeCountByUserID(?, ?, ?, ?, ?)AS count", [userID, queryParameters.search, queryParameters.startDate, queryParameters.endDate, queryParameters.states]);
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetRecipesByUserIDPaginated(userID: number, paginationParameters: PaginationParameters, queryParameters: QueryParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetRecipesByUserIDPaginated(?, ?, ?, ?, ?, ?, ?)", [userID, paginationParameters.page, paginationParameters.limit, queryParameters.search, queryParameters.startDate, queryParameters.endDate, queryParameters.states]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetAcceptedFavoriteRecipeCountByUserID(userID: number, queryParameters: QueryParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetAcceptedFavoriteRecipeCountByUserID(?, ?, ?, ?) as count", [userID, queryParameters.search, queryParameters.startDate, queryParameters.endDate]);
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetAcceptedFavoriteRecipesByUserIDPaginated(userID: number, paginationParameters: PaginationParameters, queryParameters: QueryParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetAcceptedFavoriteRecipesByUserIDPaginated(?, ?, ?, ?, ?, ?)", [userID, paginationParameters.page, paginationParameters.limit, queryParameters.search, queryParameters.startDate, queryParameters.endDate]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetAcceptedRecipeCountByUsername(username: string,queryParameters: QueryParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetAcceptedRecipeCountByUsername(?, ?, ?, ?) as count", [username, queryParameters.search, queryParameters.startDate, queryParameters.endDate]);
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetAcceptedRecipesByUsernamePaginated(username: string, paginationParameters: PaginationParameters, queryParameters: QueryParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetAcceptedRecipesByUsernamePaginated(?, ?, ?, ?, ?, ?)", [username, paginationParameters.page, paginationParameters.limit, queryParameters.search, queryParameters.startDate, queryParameters.endDate]);
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

    static async GetRecipeStateByRecipeID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetRecipeStateByRecipeID(?) AS state", [recipeID]);
            return rows[0].state;
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
            const [rows]: any = await conn.query("CALL NewRecipe(?, ?, ?, ?, ?)", [recipe.uploaderID, recipe.recipeName, recipe.preparationTime, recipe.preparationDescription, recipe.state?.stateName]);
            const insertID = rows[0][0].insertID;
            for(const ingredient of recipe.ingredients!){
                await conn.query("CALL NewIngredientByRecipeID(?, ?, ?, ?)", [insertID, ingredient.commodity?.commodityName, ingredient.measure?.measureName, ingredient.quantity]);
            }
            conn.commit();
            return insertID;
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
            const [rows]: any = await conn.query("CALL UpdateRecipeByID(?, ?, ?, ?)", [recipe.ID, recipe.recipeName, recipe.preparationTime, recipe.preparationDescription]);
            await conn.query("CALL UpdateRecipeStateByID(?, ?)", [recipe.ID, recipe.state?.stateName]);
            if(recipe.ingredients){
                for(const ingredient of recipe.ingredients){
                    if(!ingredient.measure && !ingredient.quantity){
                        await conn.query("CALL DeleteIngredientByRecipeIDAndCommodityName(?, ?)", [recipe.ID, ingredient.commodity?.commodityName]);
                    }
                    else{
                        await conn.query("CALL AddOrUpdateIngredientByRecipeIDAndCommodityName(?, ?, ?, ?)", [recipe.ID, ingredient.commodity?.commodityName, ingredient.measure?.measureName, ingredient.quantity]);
                    }
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
            const image: string = await ImageService.GetImageByRecipeID(recipeID);
            await conn.beginTransaction();

            const [rows]: any = await conn.query("CALL DeleteRecipeByID(?)", [recipeID]);

            if(image){
                await ImageService.DeleteImageByName(image);
            }

            await conn.commit();
            return rows;
        }
        catch(error){
            await conn.rollback();
            throw error;
        }
        finally{
            conn.end();
        }
    }
}