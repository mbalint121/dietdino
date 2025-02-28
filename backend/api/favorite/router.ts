import { Router } from "express";
import { NewFavorite, DeleteFavorite } from "./favorite";
import AuthService from "../services/auth";

const router: Router = Router();

router.post("/recipe/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, NewFavorite);
router.delete("/recipe/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.FavoriteExists, DeleteFavorite);

export default router;