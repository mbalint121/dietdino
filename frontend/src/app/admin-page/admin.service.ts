import { inject, Injectable } from "@angular/core";
import { PopupService } from "../popups/popup.service";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class AdminService {
    router : Router = inject(Router);
    popupService : PopupService = inject(PopupService);

    UserIsAdmin(){
        if(JSON.parse(localStorage.getItem("user") || "{}").role == "Admin"){
          return true;
        }
        return false;
    }

    UserIsAdminOrModerator(){
        if(JSON.parse(localStorage.getItem("user") || "{}").role == "Admin" || JSON.parse(localStorage.getItem("user") || "{}").role == "Moderator"){
          return true;
        }
        return false;
    }

    UserIsNotAuthorized(){
        if(!this.UserIsAdminOrModerator()){
          this.router.navigate(["/"]);
          this.popupService.ShowPopup("Ennek az oldalnak a megtekintéséhez nincs jogod!", "information");
        }
    }

    async GetAllUsers() {
        let users! : [any];
        await fetch("http://localhost:3000/api/users/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token") || ""
            }
        })
        .then(result => result.json())
        .then(data => {
            users = data.data;
        })
        .catch(error => {
            console.error(this.popupService.ShowPopup(error, "error"));
        });
        return users;
    }

}