import { UserRole } from "./user-role.type";

export class User{
    ID?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}