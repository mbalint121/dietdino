import { Response } from "express";
import { PaginationParameters } from "../models/paginationParameters";

export default class PaginationService{
    static GetPaginationParameters(req: any, res: Response, next: any){
        const {page, limit} = req.query;
        
        if(!page || !limit){
            res.status(400).send({error: "Hiányzó adatok"});
            return;
        }

        if(isNaN(page) || isNaN(limit)){
            res.status(400).send({error: "Az oldal és a limit csak szám lehet"});
            return;
        }

        const paginationParameters: PaginationParameters = {page: Number(page), limit: Number(limit)};
        req.paginationParameters = paginationParameters;
        next();
    }
}