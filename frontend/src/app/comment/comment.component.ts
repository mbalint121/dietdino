import { Component, DestroyRef, inject, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../recipes-page/recipe.service';
import { FormsModule } from '@angular/forms';
import { Comment } from '../models/comment';
import { RouterLink } from '@angular/router';
import { AdminService } from '../admin-page/admin.service';
import { PopupService } from '../popups/popup.service';
import { CommentService } from './comment.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment! : Comment;
  @Input() recipeId! : number;

  edited : boolean = false;
  commentText : string = "";

  userService : UserService = inject(UserService);
  adminService : AdminService = inject(AdminService);
  commentService : CommentService = inject(CommentService);
  popupService : PopupService = inject(PopupService);
  destroyRef : DestroyRef = inject(DestroyRef);

  ngOnInit(){
    this.commentText = this.comment.text;
  }
  
  DeleteComment(){
    const subscription = this.commentService.DeleteCommentByID(this.comment, this.recipeId).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  StartCommentEditing(){
    this.edited = true;
  }

  CancelCommentEditing(){
    this.edited = false;
    this.commentText = this.comment.text;
  }

  EditComment(){
    if(this.commentText.trim() != ""){
      this.comment.text = this.commentText;
      this.edited = false;

      const subscription = this.commentService.EditComment(this.comment).subscribe();

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }

    this.popupService.ShowPopup("A komment nem lehet üres!", "warning");
    return;
  }
}
