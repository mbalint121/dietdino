import { Router } from "express";
import { GetCommodities } from "./commodity";
import AuthService from "../services/auth";

const router: Router = Router();

router.get("", AuthService.DecodeToken, AuthService.UserExists, GetCommodities);

export default router;