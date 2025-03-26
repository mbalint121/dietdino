import { Request, Response } from "express";
import { Commodity } from "../models/commodity";
import CommodityService from "../services/commodity";
import { Measure } from "../models/measure";

export async function GetCommodities(req: Request, res: Response){
    try{
        const commodities: Array<Commodity> = await CommodityService.GetCommodities();
    
        for(const commodity of commodities){
            commodity.usableMeasureNames = await CommodityService.GetUsableMeasuresByCommodityName(commodity.commodityName!);
    
            commodity.usableMeasureNames = commodity.usableMeasureNames!.map(usableMeasure => (usableMeasure as Measure).measureName!);
        }
    
        res.status(200).send({commodities: commodities});
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