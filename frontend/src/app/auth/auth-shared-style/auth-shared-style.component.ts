import { Component } from '@angular/core';
import { AuthNavbarComponent } from "../auth-navbar/auth-navbar.component";

@Component({
  selector: 'app-auth-shared-style',
  standalone: true,
  imports: [AuthNavbarComponent],
  templateUrl: './auth-shared-style.component.html',
  styleUrl: './auth-shared-style.component.css'
})
export class AuthSharedStyleComponent {

}
