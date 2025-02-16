import { UserRole } from "./userrole";

export class User{
    ID?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}