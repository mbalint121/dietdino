import { Response } from "express";
import { QueryParameters } from "../models/queryParameters";
import { IsDateValid, IsSearchTermValid, IsStateValid } from "../validators/regex";

export default class QueryService{
    static GetQueryParameters(req: any, res: Response, next: any){
        const search = req.query.search ?? null;
        
        if(search && !IsSearchTermValid(search)){
            res.status(400).send({error: "Nem megfelelő a keresett kifejezés formátuma"});
            return;
        }

        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if(startDate && !IsDateValid(startDate) || endDate && !IsDateValid(endDate)){
            res.status(400).send({error: "Nem megfelelő a dátum formátuma"});
            return;
        }

        if(startDate){
            startDate = new Date(startDate);
        }
        else{
            startDate = new Date("0001-01-01");
        }

        if(endDate){
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate() + 1);
        }
        else{
            endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        let states = req.query.states ?? null;

        if(!states){
            states = null;
        }

        if(states){
            states = states.split(",");
            for(const state of states){
                if(!IsStateValid(state)){
                    res.status(400).send({error: "Nem megfelelő a státusz formátuma"});
                    return;
                }
            }
            states = states.join(",");
        }

        const queryParameters: QueryParameters = {search: search, startDate: startDate, endDate: endDate, states: states};
        req.queryParameters = queryParameters;
        next();
    }
}