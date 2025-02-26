import { Router } from "express";
import { NewLike, DeleteLike } from "./like";
import AuthService from "../services/auth";

const router: Router = Router();

router.post("/recipe/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, NewLike);
router.delete("/recipe/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.LikeExists, DeleteLike);

export default router;