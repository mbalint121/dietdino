import { inject, Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { UserService } from "./user.service";

@Injectable({ providedIn: "root" })
export class EditUserComponentService {
  isVisible: boolean = false;
  username!: string;
  role!: string;
  userDataChanged: Subject<void> = new Subject<void>();

  userService: UserService = inject(UserService);

  ChangeEditUserComponentVisibility() {
    this.isVisible = !this.isVisible;
  }

  GetEditedUserData(username: string, role: string) {
    this.username = username;
    this.role = role;
    this.userDataChanged.next();
  }

  GetEditedUserName() {
    return this.username;
  }

  GetEditedUserRole() {
    return this.role;
  }

  GetEditedUserId(){
    return Number.parseInt(localStorage.getItem("ID") || "");
  }

}