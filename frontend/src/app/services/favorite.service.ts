import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { tap, catchError } from "rxjs";
import { Recipe } from "../models/recipe";
import { UserService } from "./user.service";
import { PopupService } from "../popups/popup.service";

@Injectable({providedIn: "root"})
export class FavoriteService {
    userService : UserService = inject(UserService);
    httpClient : HttpClient = inject(HttpClient);
    popupService : PopupService = inject(PopupService);

    FavoriteRecipe(recipe : Recipe){
        if(recipe.userHasFavorited){
            return this.DeleteFavorite(recipe.ID!);
        } else{
            return this.NewFavorite(recipe.ID!);
        }
    }
    
    NewFavorite(id : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.post(`http://localhost:3000/api/favorites/recipe/${id}`, null, {headers: headers})
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
    
    DeleteFavorite(id : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.delete(`http://localhost:3000/api/favorites/recipe/${id}`, {headers: headers})
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

    GetFavoriteIcon(recipe : Recipe){
        return recipe.userHasFavorited ? "../../assets/active_favorite_icon.svg" : "../../assets/favorite_icon.svg";
    }
}