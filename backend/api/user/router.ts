import { Router } from "express";
import { GetUsers, GetUserById, UpdateUserSelf, UpdateUser, UpdateUserRole, DeleteUserSelf, DeleteUser } from "./user";
import AuthService from "../services/auth";

const router: Router = Router();

router.get("/", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, GetUsers);
router.get("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserItselfOrAdmin, GetUserById);
router.put("", AuthService.DecodeToken, AuthService.UserExists, UpdateUserSelf);
router.put("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, UpdateUser);
router.put("/:ID/role", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, UpdateUserRole);
router.delete("", AuthService.DecodeToken, AuthService.UserExists, DeleteUserSelf);
router.delete("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, DeleteUser);

export default router;