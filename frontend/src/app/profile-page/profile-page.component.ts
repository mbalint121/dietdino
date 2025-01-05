import { Component } from '@angular/core';
import { PageNavbarComponent } from '../page-navbar/page-navbar.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [PageNavbarComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  username = JSON.parse(localStorage.getItem("user") || '{}').username;
}
