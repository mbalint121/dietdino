import { Router } from "express";
import { GetUsers, GetUserById, UpdateUser, UpdateUserRole, DeleteUser } from "./user";
import AuthService from "../services/auth";

const router: Router = Router();

router.get("/", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, GetUsers);
router.get("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserItselfOrAdmin, GetUserById);
router.put("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserItselfOrAdmin, UpdateUser);
router.put("/:ID/role", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserAdmin, UpdateUserRole);
router.delete("/:ID", AuthService.DecodeToken, AuthService.UserExists, AuthService.IsUserItselfOrAdmin, DeleteUser);

export default router;