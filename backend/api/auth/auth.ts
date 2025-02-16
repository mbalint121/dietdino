import { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/user";
import jwt from "jsonwebtoken";

export async function LogIn(req: Request, res: Response){
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

    const userData = await UserService.GetUserByUsernameOrEmailAndPassword(user)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbáziskapcsolat során"});
        return;
    });

    Object.assign(user, userData);
    user.password = undefined;

    if(!user.ID){
        res.status(401).send({error: "Hibás email vagy jelszó"});
        return;
    }

    const { JWT_SECRET } = process.env;
    if(!JWT_SECRET){
        res.status(500).send({error: "Hiba a token létrehozásakor"});
        return;
    }

    const payload = {userID: user.ID};
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});
    
    user.ID = undefined;
    res.status(200).send({token: token, user: user});
    return;
}