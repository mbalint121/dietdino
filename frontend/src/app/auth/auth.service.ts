import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PopupService } from "../popups/popup.service";

@Injectable({providedIn: 'root'})
export class AuthService {
  popupService : PopupService = inject(PopupService);
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
      .then(result => 
        result.json()
      )
      .then(data => {
        if(data.error){
          this.popupService.message = data.error;
          this.popupService.type = "error";
          this.popupService.isVisible = true;
        }
        else{
          this.router.navigate(["/"]);
          localStorage.clear();
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          this.popupService.message = `Sikeres bejelentkezés! Üdvözöllek az oldalon ${JSON.parse(localStorage.getItem("user") || '{}').username}!`;
          this.popupService.type = "success";
          this.popupService.isVisible = true;
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
          this.popupService.message = data.error;
          this.popupService.type = "error";
          this.popupService.isVisible = true;
        }
        else{
          this.router.navigate(["/login"]);
          this.popupService.message = `Sikeres regisztráció, jelentkezz be!`;
          this.popupService.type = "success";
          this.popupService.isVisible = true;
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
        this.popupService.message = data.error;
        this.popupService.type = "error";
        this.popupService.isVisible = true;
      }
      else{
        this.router.navigate(["/login"]);
        this.popupService.message = `Az email elküldve!`;
        this.popupService.type = "success";
        this.popupService.isVisible = true;
      }
    })
    .catch(error => console.error("Error:", error))
  }

  LogOut() {
    if(localStorage.getItem("token")){
      this.popupService.isVisible = true;
      this.popupService.message = "Ki lettél jelentkeztetve!";
      this.popupService.type = "information";
    }
    localStorage.clear();
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

  ResetPassword(password: string) {
    fetch("http://localhost:3000/api/password/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("token") || ""
      },
      body: JSON.stringify({
        "password": password
      })
    })
    .then(result => result.json())
    .then(data => {
      localStorage.clear();
      if(data.error){
        this.popupService.message = data.error;
        this.popupService.type = "error";
        this.popupService.isVisible = true;
      }
      else{
        this.router.navigate(["/login"]);
        this.popupService.message = `Sikeres jelszóváltoztatás!`;
        this.popupService.type = "success";
        this.popupService.isVisible = true;
      }
    })
    .catch(error => console.error("Error:", error))
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
    if(localStorage.getItem("token")){
      this.router.navigate(["/"]);
      this.popupService.isVisible = true;
      this.popupService.message = "Már be vagy jelentkezve!";
      this.popupService.type = "information";
    }
  }

}
