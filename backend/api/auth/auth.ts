import dotenv from "dotenv";
import { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/user";
import AuthService from "../services/auth";

dotenv.config();

export async function LogIn(req: Request, res: Response){
    try{
        const user: User = new User();
        Object.assign(user, req.body);

        if(!user.username && !user.email || !user.password){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }

        if(user.username && user.email){
            res.status(400).send({error: "Vagy felhasználónévvel, vagy email címmel jelentkezzen be"});
            return;
        }

        const userData = await UserService.GetUserByUsernameOrEmailAndPassword(user);

        Object.assign(user, userData);
        user.password = undefined;
        
        if(!user.ID){
            if(user.username){
                res.status(401).send({error: "Hibás felhasználónév vagy jelszó"});
                return;
            }
            if(user.email){
                res.status(401).send({error: "Hibás email cím vagy jelszó"});
                return;
            }
        }
        
        const token = AuthService.GenerateToken(user.ID!);

        user.ID = undefined;
        res.status(200).send({message: "Sikeres bejelentkezés", token: token, user: user});
    }
    catch(err: any){
        console.log(err);
        
        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else if(err.errType = "tokenError"){
            res.status(500).send({error: "Hiba a token létrehozásakor"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}