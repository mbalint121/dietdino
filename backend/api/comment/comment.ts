import { Response } from "express";
import { Comment } from "../models/comment";
import CommentService from "../services/comment";

export async function GetCommentsByRecipeID(req: any, res: Response){
    const comments: Array<Comment> = await CommentService.GetCommentsByRecipeID(req.params.ID)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    res.status(200).send({comments: comments});
    return;
}

export async function NewComment(req: any, res: Response){
    const comment: Comment = new Comment();
    Object.assign(comment, req.body);
    comment.authorID = req.decodedToken.userID;
    comment.recipeID = req.params.ID;

    if(!comment.text){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }

    await CommentService.NewComment(comment)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a komment feltöltése során"});
            return;
        }
        res.status(201).send({message: "Komment sikeresen feltöltve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function UpdateCommentByID(req: any, res: Response){
    const comment: Comment = new Comment();
    Object.assign(comment, req.body);
    comment.ID = req.params.ID;

    if(!comment.text){
        res.status(400).send({error: "Hiányzó adatok"});
        return;
    }
        
    const currentComment: Comment = await CommentService.GetCommentByID(comment.ID!)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
    
    if(!currentComment){
        res.status(404).send({error: "Nem létezik ilyen komment"});
        return;
    }
    
    if(currentComment.text == comment.text){
        res.status(400).send({error: "Nem történt módosítás"});
        return;
    }

    await CommentService.UpdateComment(comment)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a komment frissítése során"});
            return;
        }
        res.status(200).send({message: "Komment sikeresen frissítve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}

export async function DeleteCommentByID(req: any, res: Response){
    const comment: Comment = new Comment();
    comment.ID = req.params.ID;

    const currentComment: Comment = await CommentService.GetCommentByID(comment.ID!)
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
    
    if(!currentComment){
        res.status(404).send({error: "Nem létezik ilyen komment"});
        return;
    }

    await CommentService.DeleteCommentByID(req.params.ID)
    .then(async (result) => {
        if(!result.affectedRows){
            res.status(500).send({error: "Hiba a komment törlése során"});
            return;
        }
        res.status(200).send({message: "Komment sikeresen törölve"});
        return;
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });
}