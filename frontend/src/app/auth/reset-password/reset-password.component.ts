import { Component, DestroyRef, inject } from '@angular/core';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from '../../popups/popup.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [AuthSharedStyleComponent, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  route : ActivatedRoute = inject(ActivatedRoute);
  authService : AuthService = inject(AuthService);
  popupService : PopupService = inject(PopupService);
  userService : UserService = inject(UserService);
  destroyRef : DestroyRef = inject(DestroyRef);

  newPassword! : string;
  confirmNewPassword! : string;
  token! : string;
  
  ngOnInit(){
    localStorage.clear();
    const token = this.route.snapshot.paramMap.get('token') || '';
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

    const subscription = this.authService.ResetPassword(this.newPassword).subscribe();

    this.destroyRef.onDestroy(() => {
      localStorage.removeItem("token");
      subscription.unsubscribe();
    });
  }

  ChangePasswordVisibility(){
    this.authService.ChangePasswordVisibility();
  }
  
}
