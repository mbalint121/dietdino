import { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/user";
import { UserRole } from "../models/userrole";

export async function GetUsers(req: Request, res: Response){
    const users: Array<User> = await UserService.GetUsers()
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
    res.status(200).send({users: users});
    return;
}

export async function GetUserByID(req: any, res: Response){
    const user: User = await UserService.GetUserByID(req.params.ID)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    res.status(200).send({user: user});
    return;
}

export async function UpdateUserSelf(req: any, res: Response){
    const user: User = new User();
    Object.assign(user, req.body);
    user.ID = req.decodedToken.userID;
    
    if(!user.username){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }
    
    const currentUser: User = await UserService.GetUserByID(user.ID!)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
    
    if(!currentUser){
        res.status(404).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }
    
    if(currentUser.username == user.username){
        res.status(400).send({error: "Nem történt módosítás"});
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

export async function UpdateUserByID(req: any, res: Response){
    const user: User = new User();
    Object.assign(user, req.body);
    user.ID = req.params.ID;

    if(!user.username){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    const currentUser = await UserService.GetUserByID(user.ID!)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(404).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    if(currentUser.username == user.username){
        res.status(400).send({error: "Nem történt módosítás"});
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

export async function UpdateUserRoleByID(req: any, res: Response){
    const user: User = new User();
    Object.assign(user, req.body);
    user.ID = req.params.ID;

    const userRole: UserRole = new UserRole();
    userRole.roleName = req.body.role;
    user.role = userRole;

    if(user.ID == req.decodedToken.userID){
        res.status(400).send({error: "Nem módosíthatod a saját szerepköröd"});
        return;
    }

    if(!user.role || !user.role.roleName){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    const currentUser: User = await UserService.GetUserByID(user.ID!)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(404).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    if(currentUser.role == user.role.roleName){
        res.status(400).send({error: "Nem történt módosítás"});
        return;
    }

    const userRoles: Array<UserRole> = await UserService.GetUserRoles()
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!userRoles.some((role) => role.roleName == user.role!.roleName)){
        res.status(404).send({error: "Nem létezik ilyen szerepkör"});
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
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function DeleteUserSelf(req: any, res: Response){
    const user: User = new User();
    user.ID = req.decodedToken.userID;

    const currentUser: User = await UserService.GetUserByID(user.ID!)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(404).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    await UserService.DeleteUserByID(user.ID!)
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

export async function DeleteUserByID(req: any, res: Response){
    const user = new User();
    user.ID = req.params.ID;

    const currentUser = await UserService.GetUserByID(user.ID!)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentUser){
        res.status(404).send({error: "Nem létezik ilyen felhasználó"});
        return;
    }

    await UserService.DeleteUserByID(user.ID!)
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