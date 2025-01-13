import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Request, Response } from "express";
import UserService from "./user";

export default class AuthService{
    static DecodeToken(req: any, res: Response, next: any){
        const token = req.headers?.["token"];

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
            const decodedToken: any = jwt.verify(token, JWT_SECRET);
            req.decodedToken = decodedToken;
            next();
        }
        catch{
            res.status(401).send({error: "Hibás token"});
            return;
        }
    }

    static async UserExists(req: any, res: Response, next: any){
        const decodedToken = req.decodedToken;  
    
        const user: User = new User();
        user.ID = decodedToken.userID;

        const userExists = await UserService.GetUserByID(user)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });
        if(!userExists){
            res.status(401).send({error: "Nem létezik felhasználó ezzel az azonosítóval"});
            return;
        }
        next();
    }

    static async IsUserModeratorOrAdmin(req: any, res: Response, next: any){
        const decodedToken = req.decodedToken;  
    
        const user: User = new User();
        user.ID = decodedToken.userID;
        const userRole = await UserService.GetUserRole(user)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });
        if(userRole != "Moderator" && userRole != "Admin"){
            res.status(401).send({error: "Nincs jogod ehhez a művelethez!"});
            return;
        }
        next();
    }

    static async IsUserAdmin(req: any, res: Response, next: any){
        const decodedToken = req.decodedToken;  
    
        const user: User = new User();
        user.ID = decodedToken.userID;
        const userRole = await UserService.GetUserRole(user)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });
        if(userRole != "Admin"){
            res.status(401).send({error: "Nincs jogod ehhez a művelethez!"});
            return;
        }
        next();
    }

    static async IsUserItselfOrModeratorOrAdmin(req: any, res: Response, next: any){
        const decodedToken = req.decodedToken;  
    
        const user: User = new User();
        user.ID = decodedToken.userID;
        if(user.ID != req.params.ID){
            const userRole = await UserService.GetUserRole(user)
            .catch((err) => {
                console.log(err);
                res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
                return;
            });
            if(userRole != "Moderator" && userRole != "Admin"){
                res.status(401).send({error: "Nincs jogod ehhez a művelethez!"});
                return;
            }
        }
        next();
    }

    static async IsUserItselfOrAdmin(req: any, res: Response, next: any){
        const decodedToken = req.decodedToken;  
    
        const user: User = new User();
        user.ID = decodedToken.userID;
        if(user.ID != req.params.ID){
            const userRole = await UserService.GetUserRole(user)
            .catch((err) => {
                console.log(err);
                res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
                return;
            });
            if(userRole != "Admin"){
                res.status(401).send({error: "Nincs jogod ehhez a művelethez!"});
                return;
            }
        }
        next();
    }
} 