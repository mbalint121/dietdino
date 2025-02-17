import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { RecipesPageComponent } from './recipes-page/recipes-page.component';
import { MyRecipesPageComponent } from './recipes-page/my-recipes-page/my-recipes-page.component';
import { MyFavoriteRecipesPageComponent } from './recipes-page/my-favorite-recipes-page/my-favorite-recipes-page.component';
import { UploadRecipesComponent } from './recipes-page/upload-recipes/upload-recipes.component';

export const routes: Routes = [
    { path: 'login', title: "Bejelentkezés", component: LoginComponent },
    { path: 'registration', title: "Regisztráció", component: RegistrationComponent },
    { path: 'password/send-email', title: "Elfejetett jelszó", component: ForgotPasswordComponent },
    { path: '', title: "Home", component: HomeComponent },
    { path: 'password/reset/:token', title: "Jelszó helyreállítása", component: ResetPasswordComponent },
    { path: 'admin', title: "Admin", component: AdminPageComponent },
    { path: 'profile', title: "Profil", component: ProfilePageComponent},
    { path: 'verify/:token', title: "Verify", component: VerifyComponent },
    { path: 'recipes', title: "Receptek", component: RecipesPageComponent },
    { path: 'my-recipes', title: "Receptjeim", component: MyRecipesPageComponent },
    { path: 'my-favorite-recipes', title: "Kedvenc Receptjeim", component: MyFavoriteRecipesPageComponent },
    { path: 'upload-recipe', title: "Recept feltöltése", component: UploadRecipesComponent },
];