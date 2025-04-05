import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { Comment } from "../models/comment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap, catchError } from "rxjs";
import { PopupService } from "../popups/popup.service";
import { UserService } from "../services/user.service";

@Injectable({providedIn: "root"})
export class CommentService {
    httpClient : HttpClient = inject(HttpClient);
    popupService : PopupService = inject(PopupService);
    userService : UserService = inject(UserService);
    destroyRef : DestroyRef = inject(DestroyRef);

    currencComments = signal<Comment[]>([]);
    
    SetCurrentComments(newComments: Comment[]){
        this.currencComments.set(newComments);
    }

    GetCurrentComments(){
        return this.currencComments() ?? [];
    }

    GetCommentsByRecipeID(id : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.get(`http://localhost:3000/api/comments/recipe/${id}`, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.SetCurrentComments(response.comments.reverse());
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

    NewComment(comment : Comment){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.post(`http://localhost:3000/api/comments/recipe/${comment.recipeID}`, comment, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    const subscription = this.GetCommentsByRecipeID(comment.recipeID!).subscribe();
                    this.popupService.ShowPopup(response.message, "success");

                    this.destroyRef.onDestroy(() => {
                        subscription.unsubscribe();
                    });
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

    DeleteCommentByID(comment : Comment, recipeId : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.delete(`http://localhost:3000/api/comments/${comment.ID}`, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    const subscription = this.GetCommentsByRecipeID(recipeId).subscribe();
                    this.popupService.ShowPopup(response.message, "success");

                    this.destroyRef.onDestroy(() => {
                        subscription.unsubscribe();
                    });
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

    EditComment(comment : Comment){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.put(`http://localhost:3000/api/comments/${comment.ID}`, comment, {headers: headers})
        .pipe(
            tap(response => {
                if(response){
                    this.popupService.ShowPopup("Sikeres szerkesztés.", "success");
                }
            }),
            catchError(response => {
                if(response.error){
                    this.popupService.ShowPopup(response.error.error, "error");
                }
                else{
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                return response.error.error;
            })
        );
    }
}