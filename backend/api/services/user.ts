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

    static async GetUserIDByEmail(userEmail: string){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("SELECT GetUserIDByEmail(?) AS userID", [userEmail]);
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
            const [rows]: any = await conn.query("SELECT UserExistsWithUsernameOrEmail(?, ?) AS userID", [user.username, user.email]);
            return rows[0].userID;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetUserRoles(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetUserRoles()");
            return rows[0];
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetUserRoleByID(userID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetUserRoleByID(?) AS role", [userID]);
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

    static async GetUserByID(userID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetUserByID(?)", [userID]);
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
            return rows;
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
            const [rows]: any = await conn.query("CALL UpdateUserRole(?, ?)", [user.ID, user.role?.roleName]);
            return rows;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async DeleteUserByID(userID: number){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("CALL DeleteUserByID(?)", [userID]);
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