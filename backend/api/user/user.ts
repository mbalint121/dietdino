import { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/user";

export async function GetUsers(req: Request, res: Response){
    await UserService.GetUsers()
    .then(async (result) => {
        res.status(200).send({users: result});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function GetUserById(req: any, res: Response){
    const user = new User();
    user.ID = req.params.ID;

    await UserService.GetUserById(user)
    .then(async (result) => {
        res.status(200).send({user: result});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function UpdateUserSelf(req: any, res: Response){
    const user = new User();
    user.ID = req.decodedToken.userID;
    user.username = req.body.username;

    if(!user.username){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    const currentUser = await UserService.GetUserById(user)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(400).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    if(currentUser.username == user.username){
        res.status(400).send({error: "Az új felhasználónév nem egyezhet meg a régi felhasználónévvel"});
        return;
    }

    await UserService.UpdateUser(user)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a felhasználó frissítése során"});
            return;
        }
        res.status(200).send({message: "Felhasználó sikeresen frissítve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        if(err.errno == 1062){
            res.status(400).send({error: "Ez a felhasználónév már használatban van"});
            return;
        }
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function UpdateUser(req: any, res: Response){
    const user = new User();
    user.ID = req.params.ID;
    user.username = req.body.username;

    if(!user.username){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    const currentUser = await UserService.GetUserById(user)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(400).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    if(currentUser.username == user.username){
        res.status(400).send({error: "Az új felhasználónév nem egyezhet meg a régi felhasználónévvel"});
        return;
    }

    await UserService.UpdateUser(user)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a felhasználó frissítése során"});
            return;
        }
        res.status(200).send({message: "Felhasználó sikeresen frissítve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        if(err.errno == 1062){
            res.status(400).send({error: "Ez a felhasználónév már használatban van"});
            return;
        }
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function UpdateUserRole(req: any, res: Response){
    const user = new User();
    user.ID = req.params.ID;
    user.role = req.body.role;

    if(!user.role){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    const currentUser = await UserService.GetUserById(user)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(400).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    if(currentUser.role == user.role){
        res.status(400).send({error: "Az új szerepkör nem egyezhet meg a régi szerepkörrel"});
        return;
    }

    await UserService.UpdateUserRole(user)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a felhasználó szerepkörének frissítése során"});
            return;
        }
        res.status(200).send({message: "Felhasználó szerepköre sikeresen frissítve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        if(err.errno == 1452){
            res.status(400).send({error: "Nem létezik ilyen szerepkör"});
            return;
        }
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function DeleteUser(req: any, res: Response){
    const user = new User();
    user.ID = req.params.ID;

    const currentUser = await UserService.GetUserById(user)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(400).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    await UserService.DeleteUser(user)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a felhasználó törlése során"});
            return;
        }
        res.status(200).send({message: "Felhasználó sikeresen törölve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function DeleteUserSelf(req: any, res: Response){
    const user = new User();
    user.ID = req.decodedToken.userID;

    const currentUser = await UserService.GetUserById(user)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(400).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    await UserService.DeleteUser(user)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a felhasználó törlése során"});
            return;
        }
        res.status(200).send({message: "Felhasználó sikeresen törölve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}