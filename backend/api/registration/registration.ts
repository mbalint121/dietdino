import { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/user";
import VerificationService from "../services/verification";
import jwt from "jsonwebtoken";

export async function Register(req: Request, res: Response){
    const user: User = new User();
    Object.assign(user, req.body);

    if(!user.username || !user.email || !user.password){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    const userExists = await UserService.UserExistsWithUsernameOrEmail(user)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(userExists){
        res.status(400).send({error: "Már létezik felhasználó ezzel a felhasználónévvel vagy email címmel"});
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
        return;
    }
    catch(error){
        console.log(error);
        res.status(500).send({error: "Hiba a megerősítő email küldése során"});
        return;
    }
}