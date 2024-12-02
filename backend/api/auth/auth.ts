import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.decodedToken = decodedToken;
        next();
    }
    catch{
        res.status(401).send({error: "Hibás token"});
        return;
    }
}