import { Response } from 'express';
import { Like } from '../models/like';
import LikeService from '../services/like';

export async function NewLike(req: any, res: Response){
    const like: Like = new Like();
    like.userID = req.decodedToken.userID;  
    like.recipeID = req.params.ID;

    const currentLike: Like = await LikeService.GetLike(like)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(currentLike){
        res.status(409).send({error: "Már kedvelted ezt a receptet"});
        return;
    }

    await LikeService.NewLike(like)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a recept kedvelése során"});
            return;
        }
        res.status(201).send({message: "Recept sikeresen kedvelve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function DeleteLike(req: any, res: Response){
    const like: Like = new Like();
    like.userID = req.decodedToken.userID;  
    like.recipeID = req.params.ID;

    const currentLike: Like = await LikeService.GetLike(like)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    if(!currentLike){
        res.status(404).send({error: "Még nem kedvelted ezt a receptet"});
        return;
    }

    await LikeService.DeleteLike(like)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a kedvelés törlése során"});
            return;
        }
        res.status(200).send({message: "Kedvelés sikeresen eltávolítva"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}