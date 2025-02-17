import { DestroyRef, inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PopupService } from "../popups/popup.service";
import { UserService } from "../services/user.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {
  popupService : PopupService = inject(PopupService);
  userService : UserService = inject(UserService);
  router : Router = inject(Router);
  httpClient : HttpClient = inject(HttpClient);
  destroyRef : DestroyRef = inject(DestroyRef);

  passwordIsVisible : boolean = false;
  imageName : string = "password_icon_eye_opened.svg";
  passwordInputType : string = "password";

  LogIn(userNameOrEmail: string, password: string) {
      let body: string;
      if (userNameOrEmail.includes("@")) {
        body = JSON.stringify({
          "email": userNameOrEmail,
          "password": password
        });
      } else {
        body = JSON.stringify({
          "username": userNameOrEmail,
          "password": password
        });
      }

      const headers = new HttpHeaders({ "Content-Type": "application/json" });

      return this.httpClient.post("http://localhost:3000/api/auth/login", body, { headers: headers })
      .pipe(
        tap((response : any) => {
          if(response.user){
            localStorage.clear();
            this.router.navigate(["/"]);
            this.userService.SetUserToken(response.token);
            this.userService.SetUser(response.user);
  
            this.popupService.ShowPopup(`Sikeres bejelentkezés! Üdvözöllek az oldalon ${this.userService.user()!.username}!`, "success");
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
  
  SignUp(userName: string, email: string, password: string) {

    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = JSON.stringify({
      "username": userName, 
      "email": email, 
      "password": password
    });

    return this.httpClient.post("http://localhost:3000/api/registration", body, { headers: headers })
    .pipe(
      tap((response : any) => {
        if(response){
          this.router.navigate(["/login"]);
          this.popupService.ShowPopup(response.message, "information");
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

  SendResetPasswordEmail(email: string) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = JSON.stringify({
      "email": email
    });

    return this.httpClient.post("http://localhost:3000/api/password/sendemail", body, { headers: headers })
    .pipe(
      tap((response : any) => {
        if(response){
          this.router.navigate(["/login"]);
          this.popupService.ShowPopup(`Az email elküldve!`, "success");
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

  LogOut() {
    this.router.navigate(["/login"]);
    this.userService.SetUser(null);
    if(this.IsTokenExpired(this.userService.GetUserToken() || "")){
      this.popupService.ShowPopup("A munkamenet lejárt, jelentkezz be újra!", "information");
      return;
    }
    this.popupService.ShowPopup("Sikeres kijelentkezés!", "success");
  }

  ResetPassword(password: string) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = JSON.stringify({
      "password": password
    });

    return this.httpClient.post("http://localhost:3000/api/password/reset", body, { headers: headers })
    .pipe(
      tap((response : any) => {
        if(response){
          this.router.navigate(["/login"]);
          this.popupService.ShowPopup(`Sikeres jelszóváltoztatás!`, "success");
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

  VerifyRegistration() {

    const headers = new HttpHeaders({ "Content-Type": "application/json", "token": this.userService.GetUserToken() || "" });

    return this.httpClient.post("http://localhost:3000/api/password/reset", { headers: headers })
    .pipe(
      tap((response : any) => {
        if(response){
          localStorage.clear();
          this.router.navigate(["/login"]);
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

  ChangePasswordVisibility(){
    if(this.passwordIsVisible){
      this.imageName = "password_icon_eye_closed.svg";
      this.passwordInputType = "text";
      this.passwordIsVisible = false;
    } else {
      this.imageName = "password_icon_eye_opened.svg";
      this.passwordInputType = "password";
      this.passwordIsVisible = true;
    }
  }

  IsValidEmail(email: string) : boolean{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  IsValidName(name: string) : boolean{
    const nameRegex = /^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{4,16}$/;
    return nameRegex.test(name);
  }

  IsValidPassword(password: string) : boolean{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  AlreadyLoggedIn(){
    if(this.userService.GetUserToken()){
      this.router.navigate(["/"]);
      this.popupService.ShowPopup("Már be vagy jelentkezve!", "information");
    }
  }

  IsTokenExpired(token : string){
    if(!token){
      return true;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.exp * 1000 < Date.now();
  }
}
