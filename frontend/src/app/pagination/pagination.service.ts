import { Injectable, signal } from "@angular/core";

@Injectable({providedIn: "root"})
export default class PaginationService {
    pageLimit : number = 3;
    totalPageCount = signal<number | null>(null);
    currentRecipePage = signal<number>(1);

    currentUserPage = signal<number>(1);
    currentWaitingRecipePage = signal<number>(1);
    currentDraftRecipePage = signal<number>(1);

    GetPageLimit(){
        return this.pageLimit;
    }

    SetPageLimit(newPageLimit: number){
        this.pageLimit = newPageLimit;
    }

    SetTotalPageCount(newTotalPageCount: number){
        this.totalPageCount.set(newTotalPageCount);
    }
    
    GetTotalPageCount(){ 
        return this.totalPageCount() ?? 0;
    }

    SetCurrentRecipePage(newCurrentPage: number){
        this.currentRecipePage.set(newCurrentPage);
    }

    GetCurrentRecipePage(){
        return this.currentRecipePage() ?? 1;
    }
    
    SetCurrentUserPage(newCurrentPage: number){
        this.currentUserPage.set(newCurrentPage);
    }
    
    GetCurrentUserPage(){
        return this.currentUserPage() ?? 1;
    }
    
    SetCurrentWaitingRecipePage(newCurrentPage: number){
        this.currentWaitingRecipePage.set(newCurrentPage);
    }
    
    GetCurrentWaitingRecipePage(){
        return this.currentWaitingRecipePage() ?? 1;
    }
    
    SetCurrentDraftRecipePage(newCurrentPage: number){
        this.currentDraftRecipePage.set(newCurrentPage);
    }
    
    GetCurrentDraftRecipePage(){
        return this.currentDraftRecipePage() ?? 1;
    }
    
    ResetValues(){
        this.SetPageLimit(3);
        this.SetTotalPageCount(1);
        this.SetCurrentRecipePage(1);
        this.SetCurrentUserPage(1);
        this.SetCurrentWaitingRecipePage(1);
        this.SetCurrentDraftRecipePage(1);
    }

    GetNumberOfSkeletons(){
        const numberOfSkeletons : number[] = Array.from({length: this.GetPageLimit()}, (_, i) => i + 1);
        return numberOfSkeletons;
    }
}