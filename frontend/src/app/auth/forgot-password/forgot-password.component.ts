import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";
import { PopupService } from '../../popups/popup.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, AuthSharedStyleComponent, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  popupService : PopupService = inject(PopupService);
  authService : AuthService = inject(AuthService);
  destroyRef : DestroyRef = inject(DestroyRef);
  forgotPasswordEmail! : string;

  ngOnInit(){
    this.authService.AlreadyLoggedIn();
  }

  SendResetPasswordEmail(){
    if(!this.forgotPasswordEmail){
      this.popupService.ShowPopup("Kérlek add meg az email címed", "error");
      return;
    }
    else if(!this.authService.IsValidEmail(this.forgotPasswordEmail)){
      this.popupService.ShowPopup("Hibás email cím", "error");
      return;
    }
    else{
      this.popupService.ShowPopup("Az email elküldve", "success");
    }
    const subscription = this.authService.SendResetPasswordEmail(this.forgotPasswordEmail).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
