import mysql from "mysql2/promise";
import dbConfig from "../app/config";
import { Comment } from "../models/comment";

export default class CommentService{
    static async GetCommentsByRecipeID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetCommentsByRecipeID(?)", [recipeID]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetCommentByID(commentID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetCommentByID(?)", [commentID]);
            return rows[0][0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }
    
    static async GetAuthorIDByCommentID(commentID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetAuthorIDByCommentID(?) AS authorID", [commentID]);
            return rows[0].authorID;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async NewComment(comment: Comment){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL NewCommentByRecipeID(?, ?, ?)", [comment.authorID, comment.recipeID, comment.text]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async UpdateComment(comment: Comment){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL UpdateCommentByID(?, ?)", [comment.ID, comment.text]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async DeleteCommentByID(commentID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL DeleteCommentByID(?)", [commentID]);
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