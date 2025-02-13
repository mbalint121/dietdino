import { Router } from "express";
import { GetAcceptedRecipes, GetWaitingRecipes, GetDraftRecipesByUser, NewRecipe, UpdateRecipeByID, AcceptRecipeByID, RejectRecipeByID, DeleteRecipeByID } from "./recipe";
import AuthService from "../services/auth";

const router: Router = Router();

router.get("/accepted", AuthService.DecodeToken, AuthService.UserExists, GetAcceptedRecipes);
router.get("/waiting", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, GetWaitingRecipes);
router.get("/draft", AuthService.DecodeToken, AuthService.UserExists, GetDraftRecipesByUser);
router.post("", AuthService.DecodeToken, AuthService.UserExists, NewRecipe);
router.put("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserUploader, UpdateRecipeByID);
router.put("/:ID/accept", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserModeratorOrAdmin, AcceptRecipeByID);
router.put("/:ID/reject", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserModeratorOrAdmin, RejectRecipeByID);
router.delete("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserUploaderOrAdmin, DeleteRecipeByID);

export default router;