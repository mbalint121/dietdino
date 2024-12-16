import { User } from "../models/user";
import mysql from "mysql2/promise";
import dbConfig from "../app/config";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export default class PasswordService{
    static async SendPasswordResetEmail(user: User, token: string){
        const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;

        const transporter = nodemailer.createTransport({
            service: MAIL_HOST,
            auth:{
                user: MAIL_USER,
                pass: MAIL_PASS
            }
        });

        const mailOptions = {
            from: MAIL_USER,
            to: user.email,
            subject: "Diet Dino Jelszó Visszaállítás",
            text: `Tisztelt Felhasználó!\n\nEzt emailt azért kapja, mert kérte jelszava visszaállítását.\nA jelszó visszaállításához látogasson el az alábbi linkre: http://localhost:4200/password/reset/${token}\n\nAmennyiben nem Ön kérte jelszava visszaállítását, hagyja figyelmen kívül ezt az emailt.\n\nÜdvölettel,\nA Diet Dino Csapata`
        };

        await transporter.sendMail(mailOptions);
    }

    static async ResetPassword(user: User){
        const conn = await mysql.createConnection(dbConfig);

        try{
            const [rows]: any = await conn.query("CALL ResetPassword(?, ?)", [user.ID, user.password]);
            return rows.affectedRows;
        }
        catch(error){
            throw error;
        }
    }
}