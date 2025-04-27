import { DestroyRef, effect, inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Recipe } from "../models/recipe";
import { tap, catchError, map } from "rxjs";
import { PopupService } from "../popups/popup.service";
import { UserService } from "../services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DateFilter } from "../models/date-filter";
import PaginationService from "../pagination/pagination.service";
import { AdminService } from "../admin-page/admin.service";

@Injectable({providedIn: 'root'})
export class RecipeService{
    recipes = signal<Recipe[]>([]);
    recipe = signal<Recipe | null>(null);
    httpClient : HttpClient = inject(HttpClient);
    popupService : PopupService = inject(PopupService);
    userService : UserService = inject(UserService);
    paginationService : PaginationService = inject(PaginationService);
    adminService : AdminService = inject(AdminService);
    router : Router = inject(Router);
    route : ActivatedRoute = inject(ActivatedRoute);
    destroyRef : DestroyRef = inject(DestroyRef);

    totalRecipesPageCount = signal<number>(0);

    constructor(){
        const storedRecipes = JSON.parse(localStorage.getItem("recipes") || '[]');
        if(storedRecipes){
            this.SetRecipes(storedRecipes);
        }
        
        effect(() => {
            if(this.recipes()){
                localStorage.setItem("recipes", JSON.stringify(this.recipes()));
            }
        });
    }

    SetRecipes(newRecipes: Recipe[]){
        this.recipes.set(newRecipes);
    }

    GetRecipes(){
        return this.recipes() ?? [];
    }

    SetRecipe(newRecipe: Recipe){
        this.recipe.set(newRecipe);
    }

    GetRecipe(){
        return this.recipe() ?? null;
    }

    GetAcceptedRecipes(currentPage: number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.get(`http://localhost:3000/api/recipes/accepted?page=${currentPage}&limit=${this.paginationService.GetPageLimit()}`, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.SetRecipes(response.recipes);
                    this.totalRecipesPageCount.set(response.totalPageCount);
                }
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

    NewRecipe(recipe: Recipe){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});
        return this.httpClient.post('http://localhost:3000/api/recipes', recipe, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.popupService.ShowPopup(response.message, "success");
                }
                response.type = "success";
                return response;
            }),
            catchError(response => {
                if (response.error) {
                  this.popupService.ShowPopup(response.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                response.type = "error";
                return response;
            })
        );
    }

    UpdateRecipeByID(recipe : Recipe){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.put(`http://localhost:3000/api/recipes/${recipe.ID}`, recipe, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.popupService.ShowPopup(response.message, "success");
                }
                response.type = "success";
                return response;
            }),
            catchError(response => {
                if (response.error) {
                  this.popupService.ShowPopup(response.error.error, "error");
                } else {
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                response.type = "error";
                return response;
            })
        );
    }

    GetRecipesByUser(currentPage: number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.get(`http://localhost:3000/api/recipes/mine?page=${currentPage}&limit=${this.paginationService.GetPageLimit()}`, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.SetRecipes(response.recipes);
                    this.totalRecipesPageCount.set(response.totalPageCount);
                }
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

    GetRecipeById(id : number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.get(`http://localhost:3000/api/recipes/${id}`, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.SetRecipe(response.recipe);
                }
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

    DeleteRecipeByID(id: number, uploader: string){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.delete(`http://localhost:3000/api/recipes/${id}`, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.recipes()!.splice(this.recipes()!.findIndex(recipe => recipe.ID == id), 1);
                    if(this.adminService.UserIsAdmin() && this.userService.GetUsername() != uploader){
                        this.router.navigate(['/recipes']);
                    } else{
                        this.router.navigate(['/my-recipes']);
                    }
                    this.popupService.ShowPopup(response.message, "success");
                }
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

    formatDate(date: Date): string {
        if(date == null) return '';
        const d = new Date(date);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    }

    GetFavoriteRecipes(currentPage: number){
        const headers = new HttpHeaders({ "Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.get(`http://localhost:3000/api/recipes/favorite?page=${currentPage}&limit=${this.paginationService.GetPageLimit()}`, {headers: headers})
        .pipe(
            tap((response : any) => {
                if(response){
                    this.SetRecipes(response.recipes);
                    this.totalRecipesPageCount.set(response.totalPageCount);
                }
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

    /*SearchInRecipes(searchText : string, filters : string[], dateFilter : DateFilter){
        if(this.router.url == '/my-recipes'){
            return this.GetRecipesByUser().subscribe(() => {
                this.UpdateRecipesBasedOnSearchStringAndFilters(searchText, filters, dateFilter);
            });
        }
        else if(this.router.url == '/favorite-recipes'){
            return this.GetFavoriteRecipes().subscribe(() => {
                this.UpdateRecipesBasedOnSearchStringAndFilters(searchText, [], dateFilter);
            });
        }
        else{
            return this.GetAcceptedRecipes().subscribe(() => {
                this.UpdateRecipesBasedOnSearchStringAndFilters(searchText, [], dateFilter);
            });
        }
    }*/

    UpdateRecipesBasedOnSearchStringAndFilters(searchText : string, filters : string[], dateFilter : DateFilter){
        this.recipes.update(recipes => {
            return recipes.filter(recipe => (recipe.recipeName?.toLocaleLowerCase().includes(searchText.toLowerCase()) || recipe.ingredients?.some(ingredient => ingredient.commodity?.toLowerCase().includes(searchText.toLowerCase())) || recipe.uploader?.toLowerCase().includes(searchText.toLowerCase())) && (filters!.length > 0 ? filters?.some(filter => recipe.state == filter) : true) && (dateFilter?.startDate ? this.NewDateInCorrectFormat(recipe.uploadDateTime) >= this.NewDateInCorrectFormat(dateFilter.startDate) : true) && (dateFilter?.endDate ? this.NewDateInCorrectFormat(recipe.uploadDateTime) <= this.NewDateInCorrectFormat(dateFilter.endDate) : true));
        });
    }

    GetAcceptedRecipesByUsername(username : string, currentPage: number){
        const headers = new HttpHeaders({"Content-Type": "application/json", token: this.userService.GetUserToken() || ''});

        return this.httpClient.get(`http://localhost:3000/api/recipes/user/${username}?page=${currentPage}&limit=${this.paginationService.GetPageLimit()}`, ({headers: headers}))
        .pipe(
            tap((response : any) => {
                if(response){
                    this.SetRecipes(response.recipes);
                    this.totalRecipesPageCount.set(response.totalPageCount);
                }
            }),
            catchError(response => {
                if(response.error){
                    this.popupService.ShowPopup(response.error.error, "error");
                }
                else{
                    this.popupService.ShowPopup("Váratlan hiba történt.", "error");
                }
                return response.error.error;
            })
        );
    }

    NewDateInCorrectFormat(date: Date | string): Date {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
}