import { inject, Injectable, signal } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { UserRole } from "../models/user-role.type";

@Injectable({ providedIn: "root" })
export class EditUserComponentService {
  isVisible: boolean = false;
  userData = signal<User | null>(null);

  userService: UserService = inject(UserService);

  ChangeEditUserComponentVisibility() {
    this.isVisible = !this.isVisible;
  }

  GetEditedUserData(username: string, role: UserRole | undefined) {
    this.userData.set({ username: username, role: role });
  }

  GetEditedUserName() {
    return this.userData()!.username;
  }

  GetEditedUserRole() {
    return this.userData()!.role;
  }

  SetEditedUserId(id: number) {
    localStorage.setItem("ID", id.toString());
  }

  GetEditedUserId(){
    return Number.parseInt(localStorage.getItem("ID") || "");
  }

}