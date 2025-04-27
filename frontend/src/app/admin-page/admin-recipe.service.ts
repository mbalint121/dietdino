import { effect, inject, Injectable, signal } from "@angular/core";
import { Recipe } from "../models/recipe";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserService } from "../services/user.service";
import { catchError, tap } from "rxjs";
import { PopupService } from "../popups/popup.service";
import { RecipeService } from "../recipes-page/recipe.service";
import { Router } from "@angular/router";
import PaginationService from "../pagination/pagination.service";

@Injectable({providedIn: 'root'}) 
export class AdminRecipeService{
    userService : UserService = inject(UserService);
    httpClient : HttpClient = inject(HttpClient);
    popupService : PopupService = inject(PopupService);
    recipeService : RecipeService = inject(RecipeService);
    paginationService : PaginationService = inject(PaginationService);
    router : Router = inject(Router);

    waitingRecipes = signal<Recipe[]>([]);
    draftRecipes = signal<Recipe[]>([]);

    constructor(){
        const storedWaitingRecipes = JSON.parse(localStorage.getItem("waiting-recipes") || '[]');
        if(storedWaitingRecipes){
            this.SetWaitingRecipes(storedWaitingRecipes);
        }
        const storedDraftRecipes = JSON.parse(localStorage.getItem("draft-recipes") || '[]');
        if(storedDraftRecipes){
            this.SetDraftRecipes(storedDraftRecipes);
        }
        
        effect(() => {
            if(this.waitingRecipes()){
                localStorage.setItem("waiting-recipes", JSON.stringify(this.waitingRecipes()));
            }
            if(this.draftRecipes()){
                localStorage.setItem("draft-recipes", JSON.stringify(this.draftRecipes()));
            }
            
            if(localStorage.getItem("token") == null){
                this.waitingRecipes.set([]);
                this.draftRecipes.set([]);
            }
        });
    }


    GetWaitingRecipes(currentPage : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });

        return this.httpClient.get(`http://localhost:3000/api/recipes/waiting?page=${currentPage}&limit=${this.paginationService.GetPageLimit()}`, { headers: headers })
        .pipe(
            tap((response: any) => {
                if(response){
                    this.SetWaitingRecipes(response.recipes);
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

    GetDraftRecipes(currentPage : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });

        return this.httpClient.get(`http://localhost:3000/api/recipes/draft?page=${currentPage}&limit=${this.paginationService.GetPageLimit()}`, { headers: headers })
        .pipe(
            tap((response: any) => {
                if(response){
                    this.SetDraftRecipes(response.recipes);
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

    SetWaitingRecipes(newRecipes: Recipe[]){
        this.waitingRecipes.set(newRecipes);
    }

    GetWaitingRecipesById(id : number){
        return this.waitingRecipes().find(recipe => recipe.ID == id);
    }

    SetDraftRecipes(newRecipes: Recipe[]){
        this.draftRecipes.set(newRecipes);
    }

    GetDraftRecipesById(id : number){
        return this.draftRecipes().find(recipe => recipe.ID == id);
    }

    AcceptRecipe(ID: number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });

        return this.httpClient.put(`http://localhost:3000/api/recipes/${ID}/accept`, null, { headers: headers })
        .pipe(
            tap((response: any) => {
                if(response){
                    this.SetWaitingRecipes(this.waitingRecipes().filter(recipe => recipe.ID != ID));
                    this.router.navigate(["/admin"]);
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

    RejectRecipe(id: number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });

        return this.httpClient.put(`http://localhost:3000/api/recipes/${id}/reject`, null, { headers: headers })
        .pipe(
            tap((response: any) => {
                if(response){
                    this.SetWaitingRecipes(this.waitingRecipes().filter(recipe => recipe.ID != id));
                    this.router.navigate(["/admin"]);
                    this.popupService.ShowPopup("Recept elutasítva.", "success");
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
}