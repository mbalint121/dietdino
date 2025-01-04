import { Router } from "express";
import { SendPasswordResetEmail, ResetPassword } from "./password";
import AuthService from "../services/auth";

const router: Router = Router();

router.post("/sendemail", SendPasswordResetEmail);
router.post("/reset", AuthService.DecodeToken, AuthService.UserExists, ResetPassword);

export default router;