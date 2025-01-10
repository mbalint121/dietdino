import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
    isVisible : boolean = false;
    message : string = "";
    type : string = "";
    private timedout : any;

    public ShowPopup(message : string, type : string){
        if(this.timedout){
            clearTimeout(this.timedout);
        }

        this.message = message;
        this.type = type;
        this.isVisible = true;

        this.timedout = setTimeout(() => {
            this.HidePopup();
        }, 5000);
    }

    public HidePopup(){
        this.isVisible = false;
    }

    public SavePopup(){
        localStorage.setItem("popup", JSON.stringify({
            message: this.message,
            type: this.type
        }));
    }

    public LoadPopup(){
        let popup = JSON.parse(localStorage.getItem("popup") || '{}');
        this.ShowPopup(popup.message, popup.type);
        localStorage.removeItem("popup");
    }
}
