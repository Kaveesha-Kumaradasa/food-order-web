import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomepageComponent } from './home-page/homepage.component';

@NgModule({
  declarations: [CartComponent, HomepageComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterModule
  ]
})
export class PagesModule { }
