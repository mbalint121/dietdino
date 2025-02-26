import { Request, Response } from "express";
import { Commodity } from "../models/commodity";
import CommodityService from "../services/commodity";
import { Measure } from "../models/measure";

export async function GetCommodities(req: Request, res: Response){
    const commodities: Array<Commodity> = await CommodityService.GetCommodities()
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
        return;
    });

    for(const commodity of commodities){
        commodity.usableMeasureNames = await CommodityService.GetUsableMeasuresByCommodityName(commodity.commodityName!)
        .catch((err) => {
            console.log(err);
            res.status(500).send({error: "Hiba az adatbázis kapcsolat során"});
            return;
        });

        commodity.usableMeasureNames = commodity.usableMeasureNames!.map(usableMeasure => (usableMeasure as Measure).measureName!);
    }

    res.status(200).send({commodities: commodities});
    return;
}