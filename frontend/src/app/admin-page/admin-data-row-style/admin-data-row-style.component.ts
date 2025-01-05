import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-data-row-style',
  standalone: true,
  imports: [],
  templateUrl: './admin-data-row-style.component.html',
  styleUrl: './admin-data-row-style.component.css'
})
export class AdminDataRowStyleComponent {
  @Input() numberOfCols!: string;
}
