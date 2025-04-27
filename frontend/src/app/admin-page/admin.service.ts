import { inject, Injectable, signal } from "@angular/core";
import { PopupService } from "../popups/popup.service";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs";
import PaginationService from "../pagination/pagination.service";


@Injectable({providedIn: 'root'})
export class AdminService {
    router : Router = inject(Router);
    popupService : PopupService = inject(PopupService);
    userService : UserService = inject(UserService);
    paginationService : PaginationService = inject(PaginationService);
    httpClient : HttpClient = inject(HttpClient);

    users = signal<User[]>([]);

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

    GetAllUsers(currentPage : number){
        
        const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });

        return this.httpClient.get(`http://localhost:3000/api/users?page=${currentPage}&limit=${this.paginationService.GetPageLimit()}`, { headers: headers })
        .pipe(
            tap((response : any) => {
                this.users.set(response.users);
            }),
            catchError(response => {
                if (response.error) {
                    this.popupService.ShowPopup(response.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                return response.error.error;
            })
        );
    }

    DeleteUser(id : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });

        return this.httpClient.delete("http://localhost:3000/api/users/" + id, { headers: headers })
        .pipe(
            tap((response : any) => {
                this.popupService.ShowPopup(response.message, "success");
                this.users().splice(this.users().findIndex(user => user.ID == id), 1);
            }),
            catchError(response => {
                if (response.error) {
                    this.popupService.ShowPopup(response.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                return response.error.error;
            })
        );
    }

    EditUser(id : number, username : string){
        const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });
        const body = JSON.stringify({
            "username": username
        })

        return this.httpClient.put("http://localhost:3000/api/users/" + id, body, { headers: headers })
        .pipe(
            tap((response : any) => {
                this.popupService.ShowPopup(response.message, "success");
                this.users().find(user => user.ID == id)!.username = username;
            }),
            catchError(response => {
                if (response.error) {
                    this.popupService.ShowPopup(response.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                return response.error.error;
            })
        );
    }

    EditUserRole(id : number, role : "Admin" | "Moderator" | "User" | undefined){
        const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });
        const body = JSON.stringify({
            "role": role
        })

        return this.httpClient.put("http://localhost:3000/api/users/" + id + "/role", body, { headers: headers })
        .pipe(
            tap((response : any) => {
                this.popupService.ShowPopup(response.message, "success");
                this.users().find(user => user.ID == id)!.role = role;
            }),
            catchError(response => {
                if (response.error) {
                    this.popupService.ShowPopup(response.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                return response.error.error;
            })
        );
    }
}