import { Router } from "express";
import { Register } from "./registration";

const router: Router = Router();

router.post("", Register);

export default router;