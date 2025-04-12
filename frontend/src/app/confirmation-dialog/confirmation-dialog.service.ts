import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";

@Injectable({providedIn: 'root'})
export default class ConfirmationDialogService {
    dialog : MatDialog = inject(MatDialog);

    OpenDialog(message : string){
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: message,
            exitAnimationDuration: '0ms',
            enterAnimationDuration: '0ms'
        });

        return dialogRef.afterClosed();
    }
}