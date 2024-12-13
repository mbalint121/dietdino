import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { PopupComponent } from "../../popups/popup/popup.component";
import { PopupService } from '../../popups/popup.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, AuthSharedStyleComponent, PopupComponent, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  popupService : PopupService = inject(PopupService);
  authService : AuthService = inject(AuthService);
  forgotPasswordEmail! : string;

  ngOnInit(){
    this.authService.AlreadyLoggedIn();
  }

  isValidEmail(email: string) : boolean{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  SendResetPasswordEmail(){
    this.popupService.type = "error";
    if(!this.forgotPasswordEmail){
      this.popupService.message = "Kérlek add meg az email címed";
      this.popupService.isVisible = true;
      return;
    }
    else if(!this.isValidEmail(this.forgotPasswordEmail)){
      this.popupService.message = "Hibás email cím";
      this.popupService.isVisible = true;
      return;
    }
    else{
      this.popupService.message = "Az email elküldve";
      this.popupService.type = "success";
      this.popupService.isVisible = true;
    }
    console.log(this.forgotPasswordEmail);
    this.authService.SendResetPasswordEmail(this.forgotPasswordEmail);
  }
}
