import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {

  popupService : PopupService = inject(PopupService);

  ClosePopup(){
    this.popupService.isVisible = false;
  }

}
