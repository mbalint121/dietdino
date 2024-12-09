import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user";
import { UserService } from "../services/user";

dotenv.config();

export async function Auth(req: any, res: Response, next: any){
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
        const user: User = new User();
        user.ID = decodedToken.userID;
        const userExists = await UserService.UserExistsWithId(user)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });
        if(!userExists){
            res.status(401).send({error: "Nem létezik felhasználó ezzel az azonosítóval"});
            return;
        }
        req.decodedToken = decodedToken;
        next();
    }
    catch{
        res.status(401).send({error: "Hibás token"});
        return;
    }
}