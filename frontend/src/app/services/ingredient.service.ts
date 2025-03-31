import { Injectable, signal, untracked } from "@angular/core";
import { Ingredient } from "../models/ingredient";

@Injectable({providedIn: "root"})
export class IngredientService {
    selectedIngredients = signal<Ingredient[]>([]);
    
    UpdateSelectedIngredients(index : number, newIngredient : Ingredient){
        this.selectedIngredients.update(arr => {
            if(arr){
                if(arr[index]){
                    arr[index] = newIngredient;
                    return arr;
                }
                const updated = Array.from([...arr, newIngredient]);
                return updated;
            }
            return arr;
        });

        this.SetIdForSelectedIngredients();
    }

    SetSelectedIngredients(newIngredients : Ingredient[]){
        this.selectedIngredients.set(newIngredients);
        this.SetIdForSelectedIngredients();
    }

    GetSelectedIngredients(){
        return this.selectedIngredients();
    }

    SetIdForSelectedIngredients() {
        this.selectedIngredients.set(this.selectedIngredients().map((ingredient, index) => {
            return { ...ingredient, id: index };
        }));
    }
}