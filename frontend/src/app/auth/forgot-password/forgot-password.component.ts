import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthSharedStyleComponent } from "../auth-shared-style/auth-shared-style.component";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, AuthSharedStyleComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

}
