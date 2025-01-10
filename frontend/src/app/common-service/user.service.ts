import { inject, Injectable } from "@angular/core";
import { PopupService } from "../popups/popup.service";

@Injectable({"providedIn": "root"})
export class UserService{
    popupService : PopupService = inject(PopupService);

    GetUserToken(){
        return localStorage.getItem("token");
    }

    GetUsername(){
        return JSON.parse(localStorage.getItem("user") || '{}').username;
    }

    SetUserToken(token : string){
        localStorage.setItem("token", token);
    }

    SetUser(user : any){
        localStorage.setItem("user", JSON.stringify(user));
    }

    GetUserRole(){
        return JSON.parse(localStorage.getItem("user") || '{}').role;
    }

    SetUserRole(role : string){
        let user = JSON.parse(localStorage.getItem("user") || '{}');
        user.role = role;
        localStorage.setItem("user", JSON.stringify(user));
    }

    SetUserName(username : string){
        let user = JSON.parse(localStorage.getItem("user") || '{}');
        user.username = username;
        localStorage.setItem("user", JSON.stringify(user));
    }

    UserEditSelf(username : string){
        fetch("http://localhost:3000/api/users/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": this.GetUserToken() || ""
            },
            body: JSON.stringify({
                username: username
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
            this.SetUserName(username);
            location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    }

}