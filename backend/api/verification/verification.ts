import dotenv from "dotenv";
import { Response } from "express";
import { User } from "../models/user";
import UserService from "../services/user";

dotenv.config();

export async function VerifyUser(req: any, res: Response){
    try{
        const decodedToken = req.decodedToken;
    
        const user: User = new User();
        user.username = decodedToken.username;
        user.email = decodedToken.email;
        user.password = decodedToken.password;
        
        if(!user.username || !user.email || !user.password){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }
    
        const userVerified = await UserService.UserExistsWithUsernameOrEmail(user);
        
        if(userVerified){
            res.status(409).send({error: "A regisztráció már meg lett erősítve"});
            return;
        }
        
        await UserService.RegisterUser(user)
        .then((result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Nem sikerült megerősíteni a regisztrációt"});
                return;
            }
            res.status(201).send({message: "Regisztráció sikeresen megerősítve"});
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