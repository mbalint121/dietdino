import mysql from "mysql2/promise";
import dbConfig from "../app/config";
import dotenv from "dotenv";
import { User } from "../models/user";
import { PaginationParameters } from "../models/paginationParameters";

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

    static async UserExistsWithID(userID: number){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT UserExistsWithID(?) AS count", [userID]);
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async UserExistsWithUsername(username: string){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT UserExistsWithUsername(?) AS count", [username]);
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async UserExistsWithEmail(email: string){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT UserExistsWithEmail(?) AS count", [email]);
            return rows[0].count;
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
            const [rows]: any = await conn.query("SELECT UserExistsWithUsernameOrEmail(?, ?) AS count", [user.username, user.email]);
            return rows[0].count;
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

    static async GetUserCount(){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetUserCount() AS count");
            return rows[0].count;
        }
        catch(error){
            throw error;
        }
        finally{
            conn.end();
        }
    }

    static async GetUsersPaginated(paginationParameters: PaginationParameters){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetUsersPaginated(?, ?)", [paginationParameters.page, paginationParameters.limit]);
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