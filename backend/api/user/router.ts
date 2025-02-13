import { Router } from "express";
import { GetUsers, GetUserByID, UpdateUserSelf, UpdateUserByID, UpdateUserRoleByID, DeleteUserSelf, DeleteUserByID } from "./user";
import AuthService from "../services/auth";

const router: Router = Router();

router.get("/", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, GetUsers);
router.get("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserItselfOrAdmin, GetUserByID);
router.put("", AuthService.DecodeToken, AuthService.UserExists, UpdateUserSelf);
router.put("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, UpdateUserByID);
router.put("/:ID/role", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, UpdateUserRoleByID);
router.delete("", AuthService.DecodeToken, AuthService.UserExists, DeleteUserSelf);
router.delete("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, DeleteUserByID);

export default router;