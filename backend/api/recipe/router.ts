import { Router } from "express";
import { GetAcceptedRecipes, GetWaitingRecipes, GetDraftRecipes, GetRecipesByUser, GetFavoriteRecipesByUser, GetRecipeByID, NewRecipe, UpdateRecipeByID, AcceptRecipeByID, RejectRecipeByID, DeleteRecipeByID } from "./recipe";
import AuthService from "../services/auth";

const router: Router = Router();

router.get("/accepted", AuthService.DecodeToken, AuthService.UserExists, GetAcceptedRecipes);
router.get("/waiting", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserModeratorOrAdmin, GetWaitingRecipes);
router.get("/draft", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, GetDraftRecipes);
router.get("/mine", AuthService.DecodeToken, AuthService.UserExists, GetRecipesByUser);
router.get("/favorites", AuthService.DecodeToken, AuthService.UserExists, GetFavoriteRecipesByUser);
router.get("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, GetRecipeByID);
router.post("", AuthService.DecodeToken, AuthService.UserExists, NewRecipe);
router.put("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserUploader, UpdateRecipeByID);
router.put("/:ID/accept", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserModeratorOrAdmin, AcceptRecipeByID);
router.put("/:ID/reject", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserModeratorOrAdmin, RejectRecipeByID);
router.delete("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserUploaderOrAdmin, DeleteRecipeByID);

export default router;