import { Component, inject } from '@angular/core';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../popups/popup.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthSharedStyleComponent, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService : AuthService = inject(AuthService);
  popupService : PopupService = inject(PopupService);
  loginNameOrEmail! : string;
  loginPassword! : string;
  router : Router = inject(Router);

  LogIn(){
    if(!this.loginNameOrEmail || !this.loginPassword){
      this.popupService.ShowPopup("Kérlek minden adatot adj meg", "error");
      return;
    }
    this.authService.LogIn(this.loginNameOrEmail, this.loginPassword);
  }

  ChangePasswordVisibility(){
    this.authService.ChangePasswordVisibility();
  }

  ngOnInit() {
    this.authService.AlreadyLoggedIn();
    if(localStorage.getItem("popup")){
      this.popupService.LoadPopup();
    }
  }

}
