import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";
import { Response } from "express";
import UserService from "./user";
import RecipeService from "./recipe";
import { Recipe } from "../models/recipe";

export default class AuthService{
    static DecodeToken(req: any, res: Response, next: any){
        const token: string = req.headers?.["token"];

        if(!token){
            res.status(401).send({error: "Nem található token"});
            return;
        }
    
        const {JWT_SECRET} = process.env;
        if(!JWT_SECRET){
            res.status(500).send({error: "Nem található jwt secret"});
            return;
        }
    
        try{
            const decodedToken = jwt.verify(token, JWT_SECRET);
            req.decodedToken = decodedToken;
            next();
        }
        catch{
            res.status(401).send({error: "Hibás token"});
            return;
        }
    }

    static async UserExists(req: any, res: Response, next: any){
        const user: User = await UserService.GetUserByID(req.decodedToken.userID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(!user){
            res.status(401).send({error: "Nem létezik felhasználó ezzel az azonosítóval"});
            return;
        }
        next();
    }

    static async IsUserModeratorOrAdmin(req: any, res: Response, next: any){
        const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(userRole != "Moderator" && userRole != "Admin"){
            res.status(401).send({error: "Nincs jogod ehhez a művelethez"});
            return;
        }
        next();
    }

    static async IsUserAdmin(req: any, res: Response, next: any){
        const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(userRole != "Admin"){
            res.status(401).send({error: "Nincs jogod ehhez a művelethez"});
            return;
        }
        next();
    }

    static async IsUserItselfOrModeratorOrAdmin(req: any, res: Response, next: any){
        if(req.decodedToken.userID != req.params.ID){
            const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID)
            .catch((err) => {
                console.log(err);
                res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
                return;
            });

            if(userRole != "Moderator" && userRole != "Admin"){
                res.status(401).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
        }
        next();
    }

    static async IsUserItselfOrAdmin(req: any, res: Response, next: any){
        if(req.decodedToken.userID != req.params.ID){
            const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID)
            .catch((err) => {
                console.log(err);
                res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
                return;
            });

            if(userRole != "Admin"){
                res.status(401).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
        }
        next();
    }

    static async IsUserUploader(req: any, res: Response, next: any){
        const uploaderID: number = await RecipeService.GetUploaderIDByRecipeID(req.params.ID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(req.decodedToken.userID != uploaderID){
            res.status(401).send({error: "Nincs jogod ehhez a művelethez"});
            return;
        }
        next();
    }

    static async IsUserUploaderOrAdmin(req: any, res: Response, next: any){
        const uploaderID: number = await RecipeService.GetUploaderIDByRecipeID(req.params.ID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(req.decodedToken.userID != uploaderID){
            const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID)
            .catch((err) => {
                console.log(err);
                res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
                return;
            });
            
            if(userRole != "Admin"){
                res.status(401).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
        }
        next();
    }

    static async RecipeExists(req: any, res: Response, next: any){
        const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(!recipe){
            res.status(401).send({error: "Nem létezik ilyen recept"});
            return;
        }
        next();
    }
}