import { Router } from "express";
import { VerifyUser } from "./verification";
import AuthService from "../services/auth";

const router: Router = Router();

router.post("", AuthService.DecodeToken, VerifyUser);

export default router;