import { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/user";
import PasswordService from "../services/password";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function SendPasswordResetEmail(req: Request, res: Response){
    const user: User = new User();
    Object.assign(user, req.body);

    if(!user.email){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    await UserService.GetUserIDByEmail(user.email)
    .then(async (result) => {
        user.ID = result;
        if(!user.ID){
            res.status(400).send({error: "Nem létezik felhasználó ezzel az email címmel"});
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
            res.status(200).send({message: "Az email elküldve"});
            return;
        }
        catch(error){
            console.log(error);
            res.status(500).send({error: "Hiba az email küldése során"});
            return;
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function ResetPassword(req: any, res: Response){
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
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}