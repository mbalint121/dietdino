import { Router } from "express";
import { LogIn } from "./login";

const router: Router = Router();

router.post("", LogIn);

export default router;