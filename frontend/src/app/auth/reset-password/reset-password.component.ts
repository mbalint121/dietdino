import { Component, inject } from '@angular/core';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from '../../popups/popup.service';
import { UserService } from '../../common-service/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [AuthSharedStyleComponent, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  router : ActivatedRoute = inject(ActivatedRoute);
  authService : AuthService = inject(AuthService);
  popupService : PopupService = inject(PopupService);
  userService : UserService = inject(UserService);

  newPassword! : string;
  confirmNewPassword! : string;
  token! : string;

  ChangePasswordVisibility(){
    this.authService.ChangePasswordVisibility();
  }

  ngOnInit(){
    this.authService.AlreadyLoggedIn();
    localStorage.clear();
    const token = this.router.snapshot.paramMap.get('token') || '';
    this.userService.SetUserToken(token);
  }
  
  ResetPassword(){
    if(!this.newPassword || !this.confirmNewPassword){
      this.popupService.ShowPopup("Kérlek minden adatot adj meg", "error");
      return;
    }
    else if(this.newPassword != this.confirmNewPassword){
      this.popupService.ShowPopup("A két jelszó nem egyezik", "error");
      return;
    }
    else if(!this.authService.IsValidPassword(this.newPassword)){
      this.popupService.ShowPopup("A jelszónak legalább 8 karakter hosszúnak kell lennie, legalább egy kisbetűt, nagybetűt, számot és speciális karaktert tartalmaznia kell", "error");
      return;
    }
    this.authService.ResetPassword(this.newPassword);
  }

}
