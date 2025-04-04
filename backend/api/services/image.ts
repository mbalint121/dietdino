import mysql from "mysql2/promise";
import dbConfig from "../app/config";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import RecipeService from "./recipe";
import { Recipe } from "../models/recipe";

dotenv.config();

export default class ImageService{
    static async GetImagePathByImageName(image: string){
        try{
            const IMAGES_DIR: string = process.env.IMAGES_DIR ?? "/../../images/";

            const imagePath = path.join(__dirname, IMAGES_DIR, image);

            if(!fs.existsSync(imagePath)){
                return undefined;
            }

            return imagePath;
        }
        catch(error){
            throw error;
        }
    }

    static async GetImageByRecipeID(recipeID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetImageByRecipeID(?) AS image", [recipeID]);
            return rows[0].image;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async NewImageByRecipeID(recipeID: number, image: string){
        const conn = await mysql.createConnection(dbConfig);

        let imageToDelete: string | undefined;
        
        try{
            const IMAGES_DIR: string = process.env.IMAGES_DIR ?? "/../../images/";

            const imagePath = path.join(__dirname, IMAGES_DIR, image);

            imageToDelete = imagePath;

            const oldImage: string = await ImageService.GetImageByRecipeID(recipeID);

            const state: string = await RecipeService.GetRecipeStateByRecipeID(recipeID);

            conn.beginTransaction();

            const [rows]: any = await conn.query("CALL NewImageByRecipeID(?, ?)", [recipeID, image]);
            if(state == "Accepted"){
                await conn.query("CALL UpdateRecipeStateByID(?, ?)", [recipeID, "Waiting"]);
            }

            conn.commit();

            imageToDelete = undefined;
            
            if(oldImage){
                const oldImagePath = path.join(__dirname, IMAGES_DIR, oldImage);
                imageToDelete = oldImagePath;
            }
            
            if(imageToDelete && fs.existsSync(imageToDelete)){
                fs.unlinkSync(imageToDelete);
            }

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

    static async DeleteImageByName(image: string){
        try{
            const IMAGES_DIR: string = process.env.IMAGES_DIR ?? "/../../images/";

            const imagePath = path.join(__dirname, IMAGES_DIR, image);

            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath);
            }
        }
        catch(error){
            throw error;
        }
    }
}