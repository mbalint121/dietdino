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
    }

    static async GetUserIdByEmail(user: User){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("SELECT GetUserIdByEmail(?) as userID", [user.email]);
            return rows[0].userID;
        }
        catch(error){
            throw error;
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
    }

    static async GetUserRole(user: User){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("SELECT GetUserRoleById(?) as role", [user.ID]);
            return rows[0].role;
        }
        catch(error){
            throw error;
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
    }

    static async GetUserById(user: User){
        const conn = await mysql.createConnection(dbConfig);
        
        try{
            const [rows]: any = await conn.query("CALL GetUserById(?)", [user.ID]);
            return rows[0][0];
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

    static async UpdateUser(user: User){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("CALL UpdateUser(?, ?)", [user.ID, user.username]);
            return rows;
        }
        catch(error){
            throw error;
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
    }
}