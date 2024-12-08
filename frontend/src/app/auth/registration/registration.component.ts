import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

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

  Registration(){
    if(!this.registrationName || !this.registrationEmail || !this.registrationPassword || !this.registrationConfirmPassword){
      console.log("Kérlek minden adatot adj meg");
      return;
    }
    if(this.registrationPassword != this.registrationConfirmPassword){
      console.log("A jelszavak nem egyeznek");
      return;
    }
    this.authService.SignUp(this.registrationName, this.registrationEmail, this.registrationPassword);

  }
}
