import jwt from "jsonwebtoken";
import { Response } from "express";
import { User } from "../models/user";
import UserService from "./user";
import { Recipe } from "../models/recipe";
import RecipeService from "./recipe";
import { Comment } from "../models/comment";
import CommentService from "./comment";
import { Like } from "../models/like";
import LikeService from "./like";
import { Favorite } from "../models/favorite";
import FavoriteService from "./favorite";

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

    static async RecipeExists(req: any, res: Response, next: any){
        const recipe: Recipe = await RecipeService.GetRecipeByID(req.params.ID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(!recipe){
            res.status(404).send({error: "Nem létezik ilyen recept"});
            return;
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

    static async CommentExists(req: any, res: Response, next: any){
        const comment: Comment = await CommentService.GetCommentByID(req.params.ID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(!comment){
            res.status(404).send({error: "Nem létezik ilyen hozzászólás"});
            return;
        }
        next();
    }

    static async IsUserAuthor(req: any, res: Response, next: any){
        const authorID: number = await CommentService.GetAuthorIDByCommentID(req.params.ID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(req.decodedToken.userID != authorID){
            res.status(401).send({error: "Nincs jogod ehhez a művelethez"});
            return;
        }
        next();
    }

    static async IsUserAuthorOrAdmin(req: any, res: Response, next: any){
        const authorID: number = await CommentService.GetAuthorIDByCommentID(req.params.ID)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(req.decodedToken.userID != authorID){
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

    static async LikeExists(req: any, res: Response, next: any){
        const like: Like = new Like();
        like.userID = req.decodedToken.userID;
        like.recipeID = req.params.ID;

        const currentLike: Like = await LikeService.GetLike(like)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(!currentLike){
            res.status(404).send({error: "Még nem kedvelted ezt a receptet"});
            return;
        }
        next();
    }

    static async FavoriteExists(req: any, res: Response, next: any){
        const favorite: Favorite = new Favorite();
        favorite.userID = req.decodedToken.userID;
        favorite.recipeID = req.params.ID;

        const currentFavorite: Favorite = await FavoriteService.GetFavorite(favorite)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        if(!currentFavorite){
            res.status(404).send({error: "Még nincs a kedvenceid között ez a recept"});
            return;
        }
        next();
    }
}