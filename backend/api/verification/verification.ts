import { Response } from "express";
import { User } from "../models/user";
import dotenv from "dotenv";
import UserService from "../services/user";

dotenv.config();

export async function VerifyUser(req: any, res: Response){
    const decodedToken = req.decodedToken;

    const user: User = new User();
    user.username = decodedToken.username;
    user.email = decodedToken.email;
    user.password = decodedToken.password;
    if(!user.username || !user.email || !user.password){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    let userVerified = await UserService.UserExistsWithUsernameOrEmail(user)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
    if(userVerified){
        res.status(400).send({error: "A regisztráció már meg lett erősítve"});
        return;
    }
    
    await UserService.RegisterUser(user)
    .then((result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Nem sikerült megerősíteni a regisztrációt"});
            return;
        }
        res.status(200).send({message: "Regisztráció sikeresen megerőstve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}