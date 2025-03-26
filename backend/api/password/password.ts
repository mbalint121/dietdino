import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import PasswordService from "../services/password";
import { User } from "../models/user";
import UserService from "../services/user";

dotenv.config();

export async function SendPasswordResetEmail(req: Request, res: Response){
    try{
        const user: User = new User();
        Object.assign(user, req.body);
    
        if(!user.email){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }
    
        user.ID = await UserService.GetUserIDByEmail(user.email);
        if(!user.ID){
            res.status(404).send({error: "Nem létezik felhasználó ezzel az email címmel"});
            return;
        }

        const { JWT_SECRET } = process.env;
        if(!JWT_SECRET){
            res.status(500).send({error: "Hiba a token létrehozásakor"});
            return;
        }
        const payload = {userID: user.ID};
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "15m"});
        try{
            await PasswordService.SendPasswordResetEmail(user, token);
            res.status(200).send({message: "Jelszó-visszaállító email elküldve"});
        }
        catch(err: any){
            err.errType = "emailError";
            throw err;
        }
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else if(err.errType == "emailError"){
            res.status(500).send({error: "Hiba a jelszó-visszaállító email küldése során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function ResetPassword(req: any, res: Response){
    try{
        const user: User = new User();
        user.ID = req.decodedToken.userID;
        user.password = req.body.password;
        if(!user.ID || !user.password){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }
    
        await PasswordService.ResetPassword(user)
        .then((result) => {
            if(!result){
                res.status(500).send({error: "Sikertelen jelszóváltoztatás"});
                return;
            }
            res.status(200).send({message: "Sikeres jelszóváltoztatás"});
            return;
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