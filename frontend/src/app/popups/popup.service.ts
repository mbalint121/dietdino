import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
    isVisible : boolean = false;
    message : string = "";
    type : string = "";
}
