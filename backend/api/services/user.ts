import { User } from "../models/user";
import mysql from "mysql2/promise";
import dbConfig from "../app/config";
import dotenv from "dotenv";

dotenv.config();

export default class UserService{
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
        finally{
            conn.end();
        }
    }

    static async GetUserIDByEmail(user: User){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("SELECT GetUserIDByEmail(?) as userID", [user.email]);
            return rows[0].userID;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }
    
    static async UserExistsWithUsernameOrEmail(user: User){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT UserExistsWithUsernameOrEmail(?, ?) as userID", [user.username, user.email]);
            return rows[0].userID;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetUserRole(user: User){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetUserRoleByID(?) as role", [user.ID]);
            return rows[0].role;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetUsers(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetUsers()");
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetUserByID(user: User){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetUserByID(?)", [user.ID]);
            return rows[0][0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
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
        finally{
            conn.end();
        }
    }

    static async UpdateUser(user: User){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("CALL UpdateUser(?, ?)", [user.ID, user.username]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async UpdateUserRole(user: User){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("CALL UpdateUserRole(?, ?)", [user.ID, user.role]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async DeleteUser(user: User){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("CALL DeleteUser(?)", [user.ID]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }
}