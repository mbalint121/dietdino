import { inject, Injectable } from "@angular/core";
import { Recipe } from "../models/recipe";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap, catchError } from "rxjs";
import { PopupService } from "../popups/popup.service";
import { UserService } from "./user.service";

@Injectable({providedIn: "root"})
export class LikeService {

    popupService : PopupService = inject(PopupService);
    userService : UserService = inject(UserService);
    httpClient : HttpClient = inject(HttpClient);

    LikeRecipe(recipe : Recipe){
        if(recipe.userHasLiked){
            return this.DeleteLike(recipe.ID!);
        } else{
            return this.NewLike(recipe.ID!);
        }
    }
    
    NewLike(id : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.post(`http://localhost:3000/api/likes/recipe/${id}`, {}, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.popupService.ShowPopup(response.message, "success");
                }
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
    
    DeleteLike(id : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.delete(`http://localhost:3000/api/likes/recipe/${id}`, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.popupService.ShowPopup(response.message, "success");
                }
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

    GetLikeIcon(recipe : Recipe){
        return recipe.userHasLiked ? "../../assets/liked_icon.svg" : "../../assets/like_icon.svg";
    }
}