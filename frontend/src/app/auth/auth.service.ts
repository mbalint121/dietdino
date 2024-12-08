import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
  
  router : Router = inject(Router);

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
      .then(result => {
        if(result.status == 200){
          this.router.navigate(["/"]);
        }
        return result.json();
      })
      .then(data => {
        localStorage.clear();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const user = localStorage.getItem("user");
        if (user) {
          alert(`Sikeres bejelentkezés! Üdvözöllek az oldalon ${JSON.parse(user).username}!`);
        }
        console.log(localStorage.getItem("token"));
        console.log(localStorage.getItem("user"));
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
      .then(result => {
        if(result.status == 201){
          this.router.navigate(["/login"]);
        }
        return result.json();
      })
      .then(data => {
        alert("Sikeres regisztráció!");
        console.log(data);
      })
      .catch(error => console.error("Error:", error))
  }

  LogOut() {
    localStorage.clear();
  }

}
