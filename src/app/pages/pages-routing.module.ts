import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './home-page/homepage.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from '../helpers/auth-guard'; 

const routes: Routes = [
  { path: '', redirectTo: 'pages', pathMatch: 'full' },

  { path: 'home', component: HomepageComponent, canActivate: [AuthGuard] },

  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
