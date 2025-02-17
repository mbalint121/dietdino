import { Component, DestroyRef, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  router : ActivatedRoute = inject(ActivatedRoute);
  authService : AuthService = inject(AuthService);
  userService : UserService = inject(UserService);
  destroyRef : DestroyRef = inject(DestroyRef);

  ngOnInit(){
    const token = this.router.snapshot.paramMap.get('token') || "";
    this.userService.SetUserToken(token);

    const subscription = this.authService.VerifyRegistration().subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
