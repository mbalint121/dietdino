import { Component, signal } from '@angular/core';
import { PageNavbarComponent } from "../../page-navbar/page-navbar.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upload-recipes',
  standalone: true,
  imports: [PageNavbarComponent, RouterLink],
  templateUrl: './upload-recipes.component.html',
  styleUrl: './upload-recipes.component.css'
})
export class UploadRecipesComponent {
  fileCount: number = 0;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileCount = input.files ? input.files.length : 0;
  }
}
