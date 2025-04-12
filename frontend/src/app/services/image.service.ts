import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, tap } from "rxjs";
import { PopupService } from "../popups/popup.service";
import { UserService } from "./user.service";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ImageService {
  httpClient : HttpClient = inject(HttpClient);
  popupService : PopupService = inject(PopupService);
  userService : UserService = inject(UserService);
  router : Router = inject(Router);
  

  UploadImage(recipeID: number, image: File, response : any) {
    if(image){
      const headers = new HttpHeaders({ token: this.userService.GetUserToken() || '' });
  
      const formData = new FormData();
      formData.append('image', image);
  
      return this.httpClient.post(`http://localhost:3000/api/images/recipe/${recipeID}`, formData, { headers: headers })
      .pipe(
        tap(() => {
          this.router.navigate(['/my-recipes']);
          this.popupService.ShowPopup(response.message, response.type);
        }),
        catchError((response) => {
          if (response.error) {
            this.popupService.ShowPopup(response.error.error, "error");
          } else {
            this.popupService.ShowPopup("Váratlan hiba történt.", "error");
          }
          return response.error.error;
        })
      );
    }
    this.router.navigate(['/my-recipes']);
    this.popupService.ShowPopup(response.message, response.type);
    return null;
  }

  OnImageLoadFailure($event : Event){
    const target = $event.target as HTMLImageElement;
    target.src = "../../assets/default.svg";
  }
  
}