import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-recipes',
  standalone: true,
  imports: [],
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
