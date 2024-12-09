import { Component,inject } from '@angular/core';
import { PageNavbarComponent } from "../page-navbar/page-navbar.component";
import { PopupComponent } from "../popups/popup/popup.component";
import { PopupService } from "../popups/popup.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageNavbarComponent, PopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  popupService: PopupService = inject(PopupService);

  ngOnInit(){
    if(localStorage.getItem('token') == null){
    this.popupService.isVisible = true;
    this.popupService.type = "information";
    this.popupService.message = "Nem vagy bejelentkezve!";
    }
  }
}
