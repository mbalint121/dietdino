export class User{
    ID?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: "Admin" | "Moderator" | "User";
}