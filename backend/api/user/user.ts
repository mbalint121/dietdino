import { Request, Response } from "express";
import { User } from "../models/user";
import UserService from "../services/user";
import { UserRole } from "../models/userrole";
import { IsUsernameValid } from "../validators/regex";

export async function GetUsers(req: Request, res: Response){
    try{
        const users: Array<User> = await UserService.GetUsers();

        res.status(200).send({users: users});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function GetUserByID(req: any, res: Response){
    try{
        const user: User = await UserService.GetUserByID(req.params.ID);
    
        if(!user){
            res.status(404).send({error: "Nem létezik ilyen felhasználó"});
            return;
        }
    
        res.status(200).send({user: user});
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function UpdateUserSelf(req: any, res: Response){
    try{
        const user: User = new User();
        Object.assign(user, req.body);
        user.ID = req.decodedToken.userID;
        
        if(!user.username){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }
        
        if(!IsUsernameValid(user.username)){
            res.status(400).send({error: "Nem megfelelő az felhasználónév formátuma"});
            return;
        }
        
        const currentUser: User = await UserService.GetUserByID(user.ID!);
        
        if(!currentUser){
            res.status(404).send({error: "Nem létezik ilyen felhasználó"});
            return;
        }
        
        if(currentUser.username == user.username){
            res.status(400).send({error: "Nem történt módosítás"});
            return;
        }
    
        const users: Array<User> = await UserService.GetUsers();
    
        if(users.some((currentUser) => currentUser.username?.toLowerCase() == user.username?.toLowerCase())){
            res.status(400).send({error: "Ez a felhasználónév már használatban van"});
            return
        }
        
        await UserService.UpdateUser(user)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a felhasználó frissítése során"});
                return;
            }
            res.status(200).send({message: "Felhasználó sikeresen módosítva"});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function UpdateUserByID(req: any, res: Response){
    try{
        const user: User = new User();
        Object.assign(user, req.body);
        user.ID = req.params.ID;
        
        if(!user.username){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }
        
        if(!IsUsernameValid(user.username)){
            res.status(400).send({error: "Nem megfelelő az felhasználónév formátuma"});
            return;
        }
    
        const currentUser = await UserService.GetUserByID(user.ID!);
    
        if(!currentUser){
            res.status(404).send({error: "Nem létezik ilyen felhasználó"});
            return;
        }
    
        if(currentUser.username == user.username){
            res.status(400).send({error: "Nem történt módosítás"});
            return;
        }
    
        const users: Array<User> = await UserService.GetUsers();
    
        if(users.some((currentUser) => currentUser.username?.toLowerCase() == user.username?.toLowerCase())){
            res.status(400).send({error: "Ez a felhasználónév már használatban van"});
            return;
        }
    
        await UserService.UpdateUser(user)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a felhasználó frissítése során"});
                return;
            }
            res.status(200).send({message: "Felhasználó sikeresen módosítva"});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function UpdateUserRoleByID(req: any, res: Response){
    try{
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
    
        const currentUser: User = await UserService.GetUserByID(user.ID!);
    
        if(!currentUser){
            res.status(404).send({error: "Nem létezik ilyen felhasználó"});
            return;
        }
    
        if(currentUser.role == user.role.roleName){
            res.status(400).send({error: "Nem történt módosítás"});
            return;
        }
    
        const userRoles: Array<UserRole> = await UserService.GetUserRoles();
    
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
            res.status(200).send({message: "Felhasználó szerepköre sikeresen módosítva"});
        })
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function DeleteUserSelf(req: any, res: Response){
    try{
        const user: User = new User();
        user.ID = req.decodedToken.userID;
    
        const currentUser: User = await UserService.GetUserByID(user.ID!);
    
        if(!currentUser){
            res.status(404).send({error: "Nem létezik ilyen felhasználó"});
            return;
        }

        if((currentUser.role as string) == "Admin"){
            res.status(400).send({error: "Admin felhasználó nem törölheti magát"});
            return;
        }
    
        await UserService.DeleteUserByID(user.ID!)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a felhasználó törlése során"});
                return;
            }
            res.status(200).send({message: "Felhasználó sikeresen törölve"});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}

export async function DeleteUserByID(req: any, res: Response){
    try{
        const user = new User();
        user.ID = req.params.ID;
    
        const currentUser = await UserService.GetUserByID(user.ID!);
    
        if(!currentUser){
            res.status(404).send({error: "Nem létezik ilyen felhasználó"});
            return;
        }

        if(user.ID ==req.decodedToken.userID && (currentUser.role as string) == "Admin"){
            res.status(400).send({error: "Admin felhasználó nem törölheti magát"});
            return;
        }
    
        await UserService.DeleteUserByID(user.ID!)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a felhasználó törlése során"});
                return;
            }
            res.status(200).send({message: "Felhasználó sikeresen törölve"});
        });
    }
    catch(err: any){
        console.log(err);

        if(err.hasOwnProperty("sqlState")){
            res.status(500).send({error: "Hiba az adatbázis-kapcsolat során"});
        }
        else{
            res.status(500).send({error: "Ismeretlen hiba"});
        }
    }
}