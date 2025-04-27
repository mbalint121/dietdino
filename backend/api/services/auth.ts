import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Response } from "express";
import UserService from "./user";
import { Recipe } from "../models/recipe";
import RecipeService from "./recipe";
import { Comment } from "../models/comment";
import CommentService from "./comment";
import { Like } from "../models/like";
import LikeService from "./like";
import { Favorite } from "../models/favorite";
import FavoriteService from "./favorite";

dotenv.config();

export default class AuthService{
    static GenerateToken(userID: number){
        const { JWT_SECRET } = process.env;

        if(!JWT_SECRET){
            const error: any = new Error();
            error.errType = "tokenError";
            throw error;
        }
        
        const payload = {userID: userID};
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});
        return token;
    }

    static async TryDecodeToken(req: any, res: Response, next: any){
        const token: string = req.headers?.["token"];
    
        const {JWT_SECRET} = process.env;
        if(!JWT_SECRET){
            res.status(500).send({error: "Hiba a token ellenőrzésekor"});
            return;
        }
    
        try{
            const decodedToken = jwt.verify(token, JWT_SECRET);
            req.decodedToken = decodedToken;
        }
        catch{ }
        finally{
            next();
        }
    }

    static DecodeToken(req: any, res: Response, next: any){
        const token: string = req.headers?.["token"];

        if(!token){
            res.status(401).send({error: "Nem található token"});
            return;
        }
    
        const {JWT_SECRET} = process.env;
        if(!JWT_SECRET){
            res.status(500).send({error: "Hiba a token ellenőrzésekor"});
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

    static async TryUserExists(req: any, res: Response, next: any){
        if(!req.decodedToken || !req.decodedToken.userID){
            next();
            return;
        }

        try{
            const userExists: number = await UserService.UserExistsWithID(req.decodedToken.userID);
    
            if(!userExists){
                res.status(401).send({error: "Nem létezik felhasználó ezzel az azonosítóval"});
                return;
            }
            next();
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

    static async UserExists(req: any, res: Response, next: any){
        try{
            const userExists: number = await UserService.UserExistsWithID(req.decodedToken.userID);
    
            if(!userExists){
                res.status(401).send({error: "Nem létezik felhasználó ezzel az azonosítóval"});
                return;
            }
            next();
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

    static async IsUserModeratorOrAdmin(req: any, res: Response, next: any){
        try{
            const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID);
    
            if(userRole != "Moderator" && userRole != "Admin"){
                res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
            next();
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

    static async IsUserAdmin(req: any, res: Response, next: any){
        try{
            const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID);
    
            if(userRole != "Admin"){
                res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
            next();
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

    static async IsUserItselfOrModeratorOrAdmin(req: any, res: Response, next: any){
        try{
            if(req.decodedToken.userID != req.params.ID){
                const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID);
    
                if(userRole != "Moderator" && userRole != "Admin"){
                    res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                    return;
                }
            }
            next();
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

    static async IsUserItselfOrAdmin(req: any, res: Response, next: any){
        try{
            if(req.decodedToken.userID != req.params.ID){
                const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID);
    
                if(userRole != "Admin"){
                    res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                    return;
                }
            }
            next();
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

    static async RecipeExists(req: any, res: Response, next: any){
        try{
            const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID);
    
            if(!recipe){
                res.status(404).send({error: "Nem létezik ilyen recept"});
                return;
            }
            next();
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

    static async IsRecipeAccepted(req: any, res: Response, next: any){
        try{
            const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID);
    
            if((recipe.state as string) != "Accepted"){
                res.status(401).send({error: "Ezt a műveletet csak elfogadott recepteknél lehet végrehajtani"});
                return;
            }
            next();
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

    static async IsUserUploader(req: any, res: Response, next: any){
        try{
            const uploaderID: number = await RecipeService.GetUploaderIDByRecipeID(req.params.ID);
    
            if(req.decodedToken.userID != uploaderID){
                res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
            next();
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

    static async IsUserUploaderOrAdmin(req: any, res: Response, next: any){
        try{
            const uploaderID: number = await RecipeService.GetUploaderIDByRecipeID(req.params.ID);
    
            if(req.decodedToken.userID != uploaderID){
                const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID);
                
                if(userRole != "Admin"){
                    res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                    return;
                }
            }
            next();
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

    static async CommentExists(req: any, res: Response, next: any){
        try{
            const comment: Comment = await CommentService.GetCommentByID(req.params.ID);
    
            if(!comment){
                res.status(404).send({error: "Nem létezik ilyen hozzászólás"});
                return;
            }
            next();
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

    static async IsUserAuthor(req: any, res: Response, next: any){
        try{
            const authorID: number = await CommentService.GetAuthorIDByCommentID(req.params.ID);
    
            if(req.decodedToken.userID != authorID){
                res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                return;
            }
            next();
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

    static async IsUserAuthorOrModeratorOrAdmin(req: any, res: Response, next: any){
        try{
            const authorID: number = await CommentService.GetAuthorIDByCommentID(req.params.ID);
    
            if(req.decodedToken.userID != authorID){
                const userRole: string = await UserService.GetUserRoleByID(req.decodedToken.userID);
                
                if(userRole != "Moderator" && userRole != "Admin"){
                    res.status(403).send({error: "Nincs jogod ehhez a művelethez"});
                    return;
                }
            }
            next();
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

    static async LikeExists(req: any, res: Response, next: any){
        try{
            const like: Like = new Like();
            like.userID = req.decodedToken.userID;
            like.recipeID = req.params.ID;
    
            const currentLike: Like = await LikeService.GetLike(like);
    
            if(!currentLike){
                res.status(404).send({error: "Még nem kedvelted ezt a receptet"});
                return;
            }
            next();
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

    static async FavoriteExists(req: any, res: Response, next: any){
        try{
            const favorite: Favorite = new Favorite();
            favorite.userID = req.decodedToken.userID;
            favorite.recipeID = req.params.ID;
    
            const currentFavorite: Favorite = await FavoriteService.GetFavorite(favorite);
    
            if(!currentFavorite){
                res.status(404).send({error: "Még nincs a kedvenceid között ez a recept"});
                return;
            }
            next();
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
}