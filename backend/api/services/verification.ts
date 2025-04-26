import { User } from "../models/user";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export default class VerificationService{
    static async SendUserVerificationEmail(user: User, token: string){
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
            subject: "Diet Dino Regisztráció",
            text: `Tisztelt Felhasználó!\n\nEzt emailt azért kapja, mert regisztrált oldalunkra.\nFiókja aktiváláshoz és a regisztráció befejezéséhez kérjük látogasson el az alábbi linkre: http://localhost:4200/verify/${token}\n\nAmennyiben nem Ön regisztrált az oldalra, hagyja figyelmen kívül ezt az emailt.\n\nÜdvölettel,\nA Diet Dino Csapata`
        };

        await transporter.sendMail(mailOptions);
    }
}