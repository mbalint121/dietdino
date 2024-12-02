import { Request, Response } from "express";
import { User } from "../models/user";
import { UserService } from "../services/user";

export async function Register(req: Request, res: Response){
    const user: User = new User();
    Object.assign(user, req.body);

    if(!user.username || !user.email || !user.password){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    await UserService.RegisterUser(user)
    .then((affectedRows) => {
        if(!affectedRows){
            res.status(500).send({error: "Sikertelen regisztráció"});
            return;
        }
    
        res.status(201).send({message: "Sikeres regisztráció"});
        return;
    })
    .catch((err) => {
        if(err.errno === 1062){
            res.status(400).send({error: "Már létezik felhasználó ezzel a felhasználónévvel vagy email címmel"});
            return;
        }

        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    
}