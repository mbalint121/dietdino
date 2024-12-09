import { Router } from "express";
import { SendResetPasswordEmail, ResetPassword } from "./password";
import { Auth } from "../auth/auth";

const router: Router = Router();

router.post("/sendemail", SendResetPasswordEmail);
router.post("/reset", Auth, ResetPassword);

export default router;