import mysql from "mysql2/promise";
import dbConfig from "../app/config";

export default class CommodityService{
    static async GetCommodities(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetCommodities()");
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetUsableMeasuresByCommodityName(commodityName: string){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetUsableMeasuresByCommodityName(?)", [commodityName]);
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }
}