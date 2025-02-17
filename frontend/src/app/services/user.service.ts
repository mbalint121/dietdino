import { effect, inject, Injectable, signal } from "@angular/core";
import { PopupService } from "../popups/popup.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model";
import { catchError, tap } from "rxjs";

@Injectable({"providedIn": "root"})
export class UserService{
    popupService : PopupService = inject(PopupService);
    router : Router = inject(Router);
    location : Location = inject(Location);
    httpClient : HttpClient = inject(HttpClient);

    user = signal<User | null>(null);

    constructor(){
        const storedUser = JSON.parse(localStorage.getItem("user") || '{}');
        if(storedUser){
            this.SetUser(storedUser);
        }

        effect(() => {
            if(this.user()){
                localStorage.setItem("user", JSON.stringify(this.user()));
            } else{
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }

            if(localStorage.getItem("token") == null){
                this.user() == null;
            }
        });
    }

    SetUser(user : User | null){
        this.user.set(user);
    }

    SetUserToken(token : string){
        localStorage.setItem("token", token);
    }
    
    SetUserName(username : string){
        this.user.update(user => ({ ...user!, username: username }));
    }

    GetUserToken(){
        return localStorage.getItem("token");
    }

    GetUsername(){
        return this.user()?.username ?? "";
    }


    GetUserRole(){
        return this.user()?.role;
    }


    UserEditSelf(username : string){
        return this.httpClient.put("http://localhost:3000/api/users/", { username: username }, { headers: { "Content-Type": "application/json", "token": this.GetUserToken() || "" } })
        .pipe(
            tap((response : any) => {
                if (response) {
                    this.popupService.ShowPopup(response.message , "success");
                    this.SetUserName(username);
                }
            }),
            catchError(response =>{
                if (response.error) {
                    this.popupService.ShowPopup(response.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Ismeretlen hiba történt.", "error");
                }
                return response.error.error;
            })
        );
    }

    UserDeleteSelf(){
        return this.httpClient.delete("http://localhost:3000/api/users/", { headers: { "Content-Type": "application/json", "token": this.GetUserToken() || "" } })
        .pipe(
            tap((response : any) => {
                if (response) {
                    this.user.set(null);
                    this.router.navigate(["/login"]);
                    this.popupService.ShowPopup(response.message , "success");
                }
            }),
            catchError(error => {
                if (error.error) {
                    this.popupService.ShowPopup(error.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Ismeretlen hiba történt.", "error");
                }
                return error.error.error;
            })
        );
    }
}

