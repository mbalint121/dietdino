import { Request, Response } from "express";
import { User } from "../models/user";
import { UserService } from "../services/user";
import jwt from "jsonwebtoken";

export async function LogIn(req: Request, res: Response){
    const user: User = new User();
    Object.assign(user, req.body);

    if(!user.email && !user.username || !user.password){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    await UserService.GetUserByUsernameOrEmailAndPassword(user)
    .then(resultUser => {
        if(!resultUser.ID){
            res.status(401).send({error: "Hibás email vagy jelszó"});
            return;
        }
    
        const { JWT_SECRET } = process.env;
        if(!JWT_SECRET){
            res.status(500).send({error: "Hiba a token létrehozásakor"});
            return;
        }
    
        const payload = {userID: resultUser.ID};
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});
        resultUser.ID = undefined;
        res.status(200).send({token: token, user: resultUser});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbáziskapcsolat során"});
        return;
    });
}