import { effect, inject, Injectable, signal } from "@angular/core";
import { PopupService } from "../popups/popup.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs";
import { Commodity } from "../models/commodity";
import { UserService } from "./user.service";
import { Measure } from "../models/measure";

@Injectable({"providedIn": "root"})
export class CommodityService{
    popupService : PopupService = inject(PopupService);
    router : Router = inject(Router);
    location : Location = inject(Location);
    httpClient : HttpClient = inject(HttpClient);
    userService : UserService = inject(UserService);

    commodities = signal<Commodity[]>([]);

    constructor(){
        const storedCommodity = JSON.parse(localStorage.getItem("commodities") || "[]");
        if(storedCommodity){
            this.SetCommodities(storedCommodity);
        }

        effect(() => {
            if(this.commodities()){
                localStorage.setItem("commodities", JSON.stringify(this.commodities()));
            } else{
                localStorage.removeItem("token");
                localStorage.removeItem("commodities");
            }

            if(localStorage.getItem("token") == null){
                this.commodities.set([]);
            }
        });
    }

    SetCommodities(newCommodities: Commodity[]){
        this.commodities.set(newCommodities);
    }

    GetCommodities() : Commodity[]{
        return this.commodities();
    }

    GetUsableMeasuresForCommodities(commodity : Commodity) : Measure[]{
        let measures: Measure[] = [];
        commodity.usableMeasureNames?.forEach(measure => {
            let newMeasure = new Measure();
            newMeasure.measureName = measure;
            measures.push(newMeasure);
        });
        return measures;
    }

    GetAllCommodities(){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});
        
        return this.httpClient.get("http://localhost:3000/api/commodities", {headers: headers})
        .pipe(
            tap((response: any) => {
                this.SetCommodities(response.commodities);
            }),
            catchError(response => {
                if (response.error) {
                    this.popupService.ShowPopup(response.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                return response.error.error;
            })
        );
    }
}

