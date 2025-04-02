import { Router } from "express";
import AuthService from "../services/auth";
import { GetImageByName, NewImageByRecipeID } from "./image";

const router: Router = Router();

router.get("/:image", GetImageByName);
router.post("/recipe/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserUploader, NewImageByRecipeID);

export default router;