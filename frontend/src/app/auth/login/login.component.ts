import { Component, inject } from '@angular/core';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthSharedStyleComponent, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  imageName : string = "password_icon_eye_closed.svg";
  passwordInputType : string = "password";
  authService : AuthService = inject(AuthService);
  loginNameOrEmail! : string;
  loginPassword! : string;
  router : Router = inject(Router);

  LogIn(){
    if(!this.loginNameOrEmail || !this.loginPassword){
      console.log("Kérlek minden adatot adj meg");
      return;
    }
    this.authService.LogIn(this.loginNameOrEmail, this.loginPassword);
  }

  ChangePasswordVisibility(){
    if(this.imageName == "password_icon_eye_closed.svg"){
      this.imageName = "password_icon_eye_opened.svg";
      this.passwordInputType = "text";
    } else {
      this.imageName = "password_icon_eye_closed.svg";
      this.passwordInputType = "password";
    }
  }

  ngOnInit() {
    alert("Ki vagy jelenetkezve!");
  }

}
