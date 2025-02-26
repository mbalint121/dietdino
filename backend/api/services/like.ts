import mysql from "mysql2/promise";
import dbConfig from "../app/config";
import { Like } from "../models/like";

export default class LikeService{
    static async GetLike(like: Like){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetLike(?, ?)", [like.userID, like.recipeID]);
            return rows[0][0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async NewLike(like: Like){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL NewLike(?, ?)", [like.userID, like.recipeID]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async DeleteLike(like: Like){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL DeleteLike(?, ?)", [like.userID, like.recipeID]);
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