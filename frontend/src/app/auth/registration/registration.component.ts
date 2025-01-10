import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../popups/popup.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, AuthSharedStyleComponent, FormsModule],
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
      this.popupService.ShowPopup("Kérlek minden adatot adj meg", "error");
      return;
    }
    else if(!this.authService.IsValidName(this.registrationName)){
      this.popupService.ShowPopup("A felhasználónévnek 4 és 16 karakter között kell lennie", "error");
      return;
    }
    else if(!this.authService.IsValidEmail(this.registrationEmail)){
      this.popupService.ShowPopup("Hibás email cím", "error");
      return;
    }
    else if(!this.authService.IsValidPassword(this.registrationPassword)){
      this.popupService.ShowPopup("A jelszónak legalább 8 karakter hosszúnak kell lennie, legalább egy kisbetűt, nagybetűt, számot és speciális karaktert tartalmaznia kell", "error");
      return;
    }
    else if(this.registrationPassword != this.registrationConfirmPassword){
      this.popupService.ShowPopup("A jelszavak nem egyeznek", "error");
      return;
    }
    this.authService.SignUp(this.registrationName, this.registrationEmail, this.registrationPassword);
  }

  ngOnInit(){
    this.authService.AlreadyLoggedIn();
  }

  ChangePasswordVisibility(){
    this.authService.ChangePasswordVisibility();
  }

}
