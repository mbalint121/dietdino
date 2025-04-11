import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import VerificationService from "../services/verification";
import { User } from "../models/user";
import UserService from "../services/user";
import { IsUsernameValid, IsEmailValid, IsPasswordValid } from "../validators/regex";

export async function Register(req: Request, res: Response){
    try{
        const user: User = new User();
        Object.assign(user, req.body);
        
        if(!user.username || !user.email || !user.password){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }
        
        if(!IsUsernameValid(user.username)){
            res.status(400).send({error: "Nem megfelelő az felhasználónév formátuma"});
            return;
        }
        
        if(!IsEmailValid(user.email)){
            res.status(400).send({error: "Nem megfelelő az email cím formátuma"});
            return;
        }
        
        if(!IsPasswordValid(user.password)){
            res.status(400).send({error: "Nem megfelelő a jelszó formátuma"});
            return;
        }
    
        const existingUsers: Array<User> = await UserService.GetUsers();
    
        if(existingUsers.some(existingUser => existingUser.username?.toLowerCase() == user.username?.toLowerCase())){
            res.status(409).send({error: "Már létezik felhasználó ezzel a felhasználónévvel"});
            return;
        }
    
        if(existingUsers.some(existingUser => existingUser.email == user.email)){
            res.status(409).send({error: "Már létezik felhasználó ezzel az email címmel"});
            return;
        }
    
        const payload = {username: user.username, email: user.email, password: user.password};
        const { JWT_SECRET } = process.env;
        if(!JWT_SECRET){
            res.status(500).send({error: "Hiba a token létrehozásakor"});
            return;
        }
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "15m"});
    
        try{
            await VerificationService.SendUserVerificationEmail(user, token);
            res.status(200).send({message: "Megerősítő email elküldve"});
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
            res.status(500).send({error: "Hiba a megerősítő email küldése során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}