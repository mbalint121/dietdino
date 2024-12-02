import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'login', title: "Bejelentkezés", component: LoginComponent },
    { path: 'registration', title: "Regisztráció", component: RegistrationComponent },
    { path: 'forgot-password', title: "Elfejetett jelszó", component: ForgotPasswordComponent },
    { path: '', title: "Home", component: HomeComponent }
];
