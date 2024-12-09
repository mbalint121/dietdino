import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from "../../popups/popup/popup.component";
import { PopupService } from '../../popups/popup.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, AuthSharedStyleComponent, FormsModule, PopupComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  authService : AuthService = inject(AuthService);
  registrationName! : string;
  registrationEmail! : string;
  registrationPassword! : string;
  registrationConfirmPassword! : string;
  router : Router = inject(Router); 
  popupService : PopupService = inject(PopupService);

  Registration(){
    this.popupService.type = "error";
    if(!this.registrationName || !this.registrationEmail || !this.registrationPassword || !this.registrationConfirmPassword){
      this.popupService.message = "Kérlek minden adatot adj meg";
      this.popupService.isVisible = true;
      return;
    }
    else if(!this.authService.isValidName(this.registrationName)){
      this.popupService.message = "A felhasználónévnek 4 és 16 karakter között kell lennie";
      this.popupService.isVisible = true;
      return;
    }
    else if(!this.authService.isValidEmail(this.registrationEmail)){
      this.popupService.message = "Hibás email cím";
      this.popupService.isVisible = true;
      return;
    }
    else if(!this.authService.isValidPassword(this.registrationPassword)){
      this.popupService.message = "A jelszónak legalább 8 karakter hosszúnak kell lennie, legalább egy kisbetűt, nagybetűt, számot és speciális karaktert tartalmaznia kell";
      this.popupService.isVisible = true;
      return;
    }
    else if(this.registrationPassword != this.registrationConfirmPassword){
      this.popupService.message = "A jelszavak nem egyeznek";
      this.popupService.isVisible = true;
      return;
    }
    this.authService.SignUp(this.registrationName, this.registrationEmail, this.registrationPassword);

  }
}
