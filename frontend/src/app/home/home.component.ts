import { Component,inject } from '@angular/core';
import { PageNavbarComponent } from "../page-navbar/page-navbar.component";
import { PopupService } from "../popups/popup.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageNavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  popupService: PopupService = inject(PopupService);

  ngOnInit(){
    if(localStorage.getItem('token') == null){
      this.popupService.ShowPopup("Nem vagy bejelentkezve!", "information");
    }
  }
}
