import { Response } from "express";
import dotenv from "dotenv";
import { Recipe } from "../models/recipe";
import RecipeService from "../services/recipe";
import UserService from "../services/user";
import ImageService from "../services/image";
import { uploadMiddleware } from "./middleware";

dotenv.config();

export async function GetImageByName(req: any, res: Response){
    try{
        const imagePath: string | undefined = await ImageService.GetImagePathByImageName(req.params.image);

        if(!imagePath){
            res.status(404).send({error: "Nem létezik ilyen kép"});
            return;
        }

        res.status(200).sendFile(imagePath);
    }
    catch(err: any){
        console.log(err);

        res.status(500).send({error: "Ismeretlen hiba"});
    }
}

export async function NewImageByRecipeID(req: any, res: any){
    try{
        const recipeID: number = req.params.ID;

        await uploadMiddleware(req, res);

        if(!req.file){
            res.status(400).send({message:"Kép feltöltése kötelező"});
            return;
        }

        await ImageService.NewImageByRecipeID(recipeID, req.hashFileName)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a kép feltöltése során"});
                return;
            }
            res.status(201).send({message: "Kép sikeresen feltöltve"});
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