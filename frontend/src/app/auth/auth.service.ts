import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PopupService } from "../popups/popup.service";
import { UserService } from "../common-service/user.service";

@Injectable({providedIn: 'root'})
export class AuthService {
  popupService : PopupService = inject(PopupService);
  userService : UserService = inject(UserService);
  router : Router = inject(Router);

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

      fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: body
      })
      .then(result => result.json())
      .then(data => {
        if(data.error){
          this.popupService.ShowPopup(data.error, "error");
        }
        else{
          this.router.navigate(["/"]);
          localStorage.clear();
          this.userService.SetUserToken(data.token);
          this.userService.SetUser(data.user);

          this.popupService.ShowPopup(`Sikeres bejelentkezés! Üdvözöllek az oldalon ${JSON.parse(localStorage.getItem("user") || '{}').username}!`, "success");
        }
      })
      .catch(error => console.error("Error:", error));
  }
  
  SignUp(userName: string, email: string, password: string) {
      fetch("http://localhost:3000/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "username": userName, 
          "email": email, 
          "password": password
      })
      })
      .then(result =>
        result.json()
      )
      .then(data => {
        if(data.error){
          this.popupService.ShowPopup(data.error, "error");
        }
        else{
          this.router.navigate(["/login"]);
          this.popupService.ShowPopup(data.message, "information");
        }
      })
      .catch(error => console.error("Error:", error))
  }

  SendResetPasswordEmail(email: string) {
    fetch("http://localhost:3000/api/password/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "email": email
      })
    })
    .then(result =>
      result.json()
    )
    .then(data => {
      if(data.error){
        this.popupService.ShowPopup(data.error, "error");
      }
      else{
        this.router.navigate(["/login"]);
        this.popupService.ShowPopup(`Az email elküldve!`, "success");
      }
    })
    .catch(error => console.error("Error:", error))
  }

  LogOut() {
    if(this.userService.GetUserToken()){
      this.popupService.ShowPopup("Sikeres kijelentkezés!", "success");
    }
    localStorage.clear();
  }

  ResetPassword(password: string) {
    fetch("http://localhost:3000/api/password/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": this.userService.GetUserToken() || ""
      },
      body: JSON.stringify({
        "password": password
      })
    })
    .then(result => result.json())
    .then(data => {
      localStorage.clear();
      if(data.error){
        this.popupService.ShowPopup(data.error, "error");
      }
      else{
        this.router.navigate(["/login"]);
        this.popupService.ShowPopup(`Sikeres jelszóváltoztatás!`, "success");
      }
    })
    .catch(error => console.error("Error:", error))
  }

  VerifyRegistration() {
    fetch("http://localhost:3000/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": this.userService.GetUserToken() || ""
      }
    })
    .then(result => result.json())
    .then(data => {
      localStorage.clear();
      this.router.navigate(["/login"]);
      this.popupService.ShowPopup(data.message, "success");
    })
    .catch(error => {
      this.popupService.ShowPopup(error, "error");
    })
  }

  ChangePasswordVisibility(){
    if(this.imageName == "password_icon_eye_opened.svg"){
      this.imageName = "password_icon_eye_closed.svg";
      this.passwordInputType = "text";
    } else {
      this.imageName = "password_icon_eye_opened.svg";
      this.passwordInputType = "password";
    }
  }

  IsValidEmail(email: string) : boolean{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  IsValidName(name: string) : boolean{
    const nameRegex = /^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+$/;
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

}
