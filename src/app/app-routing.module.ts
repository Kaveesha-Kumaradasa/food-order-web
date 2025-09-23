import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth-guard'; // <-- make sure this path matches where you put the guard

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'home' },


  {
    path: 'home',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },

  { path: '', pathMatch: 'full', redirectTo: 'home' },

  // protected module(s)
  {
    path: 'cart',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard],                 
  },

  // catch-all
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
