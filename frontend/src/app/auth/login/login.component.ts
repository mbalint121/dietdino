import { Component, DestroyRef, inject } from '@angular/core';
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
  destroyRef : DestroyRef = inject(DestroyRef);
  
  ngOnInit() {
    this.authService.AlreadyLoggedIn();
  }
  
  LogIn(){
    if(!this.loginNameOrEmail || !this.loginPassword){
      this.popupService.ShowPopup("Kérlek minden adatot adj meg", "error");
      return;
    }
    const subscription = this.authService.LogIn(this.loginNameOrEmail, this.loginPassword).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  ChangePasswordVisibility(){
    this.authService.ChangePasswordVisibility();
  }
}
