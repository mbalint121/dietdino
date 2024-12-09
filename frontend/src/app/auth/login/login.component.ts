import { Component, inject } from '@angular/core';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from "../../popups/popup/popup.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthSharedStyleComponent, RouterLink, FormsModule, PopupComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
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
    this.authService.ChangePasswordVisibility();
  }

  ngOnInit() {
    if(localStorage.getItem("token")){
      this.authService.LogOut();
    }
  }

}
