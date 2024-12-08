import { Component } from '@angular/core';
import { PageNavbarComponent } from "../page-navbar/page-navbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageNavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
}
