import { Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { PopupService } from './popups/popup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Diet Dino';
  popupService : PopupService = inject(PopupService);
  router : Router = inject(Router);

  ngOnInit(){
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart){
        this.popupService.isVisible = false;
      }
    });
  }
}
