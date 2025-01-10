import { inject, Injectable } from "@angular/core";
import { PopupService } from "../popups/popup.service";
import { Router } from "@angular/router";
import { UserService } from "../common-service/user.service";


@Injectable({providedIn: 'root'})
export class AdminService {
    router : Router = inject(Router);
    popupService : PopupService = inject(PopupService);
    userService : UserService = inject(UserService);

    UserIsAdmin(){
        if(this.userService.GetUserRole() == "Admin"){
          return true;
        }
        return false;
    }

    UserIsAdminOrModerator(){
        if(this.userService.GetUserRole() == "Admin" || this.userService.GetUserRole() == "Moderator"){
          return true;
        }
        return false;
    }

    UserIsNotAuthorized(){
        if(!this.UserIsAdminOrModerator()){
          this.router.navigate(["/"]);
          this.popupService.ShowPopup("Ennek az oldalnak a megtekintéséhez nincs jogod!", "warning");
        }
    }

    async GetAllUsers() {
        let users! : [any];
        await fetch("http://localhost:3000/api/users/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": this.userService.GetUserToken() || ""
            }
        })
        .then(result => result.json())
        .then(data => {
            users = data.users;
        })
        .catch(error => {
            console.error(this.popupService.ShowPopup(error, "error"));
        });
        return users;
    }

    DeleteUser(id : number){
        fetch("http://localhost:3000/api/users/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "token": this.userService.GetUserToken() || ""
            }
        })
        .then(result => result.json())
        .then(data => {
            if(data.error){
                this.popupService.ShowPopup(data.error, "error");
            } else{
                this.popupService.ShowPopup(data.message, "success");
            }
            this.popupService.SavePopup();
            location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    }

    EditUserRole(id : number, role : string){
        fetch("http://localhost:3000/api/users/" + id + "/role", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": this.userService.GetUserToken() || ""
            },
            body: JSON.stringify({
                "role": role
            })
        })
        .then(result => result.json())
        .then(data => {
            if(data.error){
                this.popupService.ShowPopup(data.error, "error");
            } else{
                this.popupService.ShowPopup(data.message, "success");
            }
            this.popupService.SavePopup();
            location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    }

    EditUser(id : number, username : string){
        fetch("http://localhost:3000/api/users/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": this.userService.GetUserToken() || ""
            },
            body: JSON.stringify({
                "username": username
            })
        })
        .then(result => result.json())
        .then(data => {
            if(data.error){
                this.popupService.ShowPopup(data.error, "error");
            } else{
                this.popupService.ShowPopup(data.message, "success");
            }
            this.popupService.SavePopup();
            location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    }

}