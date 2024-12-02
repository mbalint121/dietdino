import { User } from "../models/user";
import mysql from "mysql2/promise";
import dbConfig from "../app/config";

export class UserService{
    static async GetUserByUsernameOrEmailAndPassword(user: User){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetUserByUsernameOrEmailAndPassword(?, ?, ?)", [user.username, user.email, user.password]);
            const resultUser = Object.assign(new User(), rows[0][0]);
            if(!resultUser){
                return 0;
            }
            return resultUser;
        }
        catch(error){
            throw error;
        }
    }

    static async RegisterUser(user: User){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("CALL RegisterUser(?, ?, ?)", [user.username, user.email, user.password]);
            return rows.affectedRows;
        }
        catch(error){
            throw error;
        }
    }
}