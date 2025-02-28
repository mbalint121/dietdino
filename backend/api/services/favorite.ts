import mysql from "mysql2/promise";
import dbConfig from "../app/config";
import { Favorite } from "../models/favorite";

export default class FavoriteService{
    static async GetFavorite(favorite: Favorite){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetFavorite(?, ?)", [favorite.userID, favorite.recipeID]);
            return rows[0][0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async NewFavorite(favorite: Favorite){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL NewFavorite(?, ?)", [favorite.userID, favorite.recipeID]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async DeleteFavorite(favorite: Favorite){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL DeleteFavorite(?, ?)", [favorite.userID, favorite.recipeID]);
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