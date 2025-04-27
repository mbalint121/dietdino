import { Router } from "express";
import { GetHotRecipes, GetFreshRecipes, GetAcceptedRecipes, GetWaitingRecipes, GetDraftRecipes, GetRecipesByUserSelf, GetFavoriteRecipesByUser, GetRecipesByUser, GetRecipeByID, NewRecipe, UpdateRecipeByID, AcceptRecipeByID, RejectRecipeByID, DeleteRecipeByID } from "./recipe";
import AuthService from "../services/auth";
import PaginationService from "../services/pagination";
import QueryService from "../services/query";

const router: Router = Router();

router.get("/hot", AuthService.TryDecodeToken, AuthService.TryUserExists, GetHotRecipes);
router.get("/fresh", AuthService.TryDecodeToken, AuthService.TryUserExists, GetFreshRecipes);
router.get("/accepted", AuthService.DecodeToken, AuthService.UserExists, PaginationService.GetPaginationParameters, QueryService.GetQueryParameters, GetAcceptedRecipes);
router.get("/waiting", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserModeratorOrAdmin, PaginationService.GetPaginationParameters, GetWaitingRecipes);
router.get("/draft", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, PaginationService.GetPaginationParameters, GetDraftRecipes);
router.get("/mine", AuthService.DecodeToken, AuthService.UserExists, PaginationService.GetPaginationParameters, QueryService.GetQueryParameters, GetRecipesByUserSelf);
router.get("/favorite", AuthService.DecodeToken, AuthService.UserExists, PaginationService.GetPaginationParameters, QueryService.GetQueryParameters, GetFavoriteRecipesByUser);
router.get("/user/:username", AuthService.DecodeToken, AuthService.UserExists, PaginationService.GetPaginationParameters, QueryService.GetQueryParameters, GetRecipesByUser);
router.get("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, GetRecipeByID);
router.post("", AuthService.DecodeToken, AuthService.UserExists, NewRecipe);
router.put("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserUploader, UpdateRecipeByID);
router.put("/:ID/accept", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserModeratorOrAdmin, AcceptRecipeByID);
router.put("/:ID/reject", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserModeratorOrAdmin, RejectRecipeByID);
router.delete("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsUserUploaderOrAdmin, DeleteRecipeByID);

export default router;