import { Component, inject } from '@angular/core';
import { AuthSharedStyleComponent } from "../auth-shared-style.component";
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from '../../../popups/popup.service';
import { PopupComponent } from '../../../popups/popup/popup.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [AuthSharedStyleComponent, FormsModule, PopupComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  router : ActivatedRoute = inject(ActivatedRoute);
  authService : AuthService = inject(AuthService);
  popupService : PopupService = inject(PopupService);

  newPassword! : string;
  confirmNewPassword! : string;
  token! : string;

  ChangePasswordVisibility(){
    this.authService.ChangePasswordVisibility();
  }

  ngOnInit(){
    localStorage.clear();
    const token = this.router.snapshot.paramMap.get('token') || '';
    localStorage.setItem("token", token);
  }
  
  ResetPassword(){
    this.popupService.type = "error";
    if(!this.newPassword || !this.confirmNewPassword){
      this.popupService.message = "Kérlek minden adatot adj meg";
      this.popupService.isVisible = true;
      return;
    }
    else if(this.newPassword != this.confirmNewPassword){
      this.popupService.message = "A két jelszó nem egyezik";
      this.popupService.isVisible = true;
      return;
    }
    else if(!this.authService.isValidPassword(this.newPassword)){
      this.popupService.message = "A jelszónak legalább 8 karakter hosszúnak kell lennie, legalább egy kisbetűt, nagybetűt, számot és speciális karaktert tartalmaznia kell";
      this.popupService.isVisible = true;
      return;
    }
    console.log(this.newPassword);
    console.log(localStorage.getItem("token"));
    this.authService.ResetPassword(this.newPassword);
  }

}
