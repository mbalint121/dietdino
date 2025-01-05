import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

export const routes: Routes = [
    { path: 'login', title: "Bejelentkezés", component: LoginComponent },
    { path: 'registration', title: "Regisztráció", component: RegistrationComponent },
    { path: 'password/send-email', title: "Elfejetett jelszó", component: ForgotPasswordComponent },
    { path: '', title: "Home", component: HomeComponent },
    { path: 'password/reset/:token', title: "Jelszó helyreállítása", component: ResetPasswordComponent },
    { path: 'admin', title: "Admin", component: AdminPageComponent },
    { path: 'profile', title: "Profil", component: ProfilePageComponent},
];