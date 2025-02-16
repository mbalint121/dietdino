import { Router } from "express";
import { LogIn } from "./auth";

const router: Router = Router();

router.post("/login", LogIn);

export default router;