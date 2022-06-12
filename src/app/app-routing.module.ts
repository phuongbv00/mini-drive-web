import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'page' },
  { path: 'page', loadChildren: () => import('./page/page.module').then(m => m.PageModule), canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
