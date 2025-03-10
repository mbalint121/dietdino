import { Router } from "express";
import { GetCommentsByRecipeID, NewComment, UpdateCommentByID, DeleteCommentByID } from "./comment";
import AuthService from "../services/auth";

const router: Router = Router();

router.get("/recipe/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, GetCommentsByRecipeID);
router.post("/recipe/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.RecipeExists, AuthService.IsRecipeAccepted, NewComment);
router.put("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.CommentExists, AuthService.IsUserAuthor, UpdateCommentByID);
router.delete("/:ID", AuthService.DecodeToken, AuthService.UserExists,AuthService.CommentExists, AuthService.IsUserAuthorOrAdmin, DeleteCommentByID);

export default router;