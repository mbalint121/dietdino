import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  dialogRef : MatDialogRef<ConfirmationDialogComponent> = inject(MatDialogRef);
  data : string = inject(MAT_DIALOG_DATA);
  
  Confirm(){
    this.dialogRef.close('ok');
  }

  Cancel(){
    this.dialogRef.close('cancel');
  }
}
