import { Response } from 'express';
import { Favorite } from '../models/favorite';
import FavoriteService from '../services/favorite';

export async function NewFavorite(req: any, res: Response){
    try{
        const favorite: Favorite = new Favorite();
        favorite.userID = req.decodedToken.userID;  
        favorite.recipeID = req.params.ID;
    
        const currentFavorite: Favorite = await FavoriteService.GetFavorite(favorite);
    
        if(currentFavorite){
            res.status(409).send({error: "Már a kedvenceid között van ez a recept"});
            return;
        }
    
        await FavoriteService.NewFavorite(favorite)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a recept kedvencekhez adása során"});
                return;
            }
            res.status(201).send({message: "Recept sikeresen a kedvencekhez adva"});
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

export async function DeleteFavorite(req: any, res: Response){
    try{
        const favorite: Favorite = new Favorite();
        favorite.userID = req.decodedToken.userID;  
        favorite.recipeID = req.params.ID;
    
        const currentFavorite: Favorite = await FavoriteService.GetFavorite(favorite);
    
        if(!currentFavorite){
            res.status(404).send({error: "Még nincs a kedvenceid között ez a recept"});
            return;
        }
    
        await FavoriteService.DeleteFavorite(favorite)
        .then(async (result) => {
            if(!result.affectedRows){
                res.status(500).send({error: "Hiba a recept kedvencek közül való törlése során"});
                return;
            }
            res.status(200).send({message: "Recept sikeresen eltávolítva a kedvencek közül"});
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