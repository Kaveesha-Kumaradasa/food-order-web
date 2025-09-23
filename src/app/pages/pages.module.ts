import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../layouts/shared/shared.module';
import { HomepageComponent } from './home-page/homepage.component';
import { CartComponent } from './cart/cart.component';
import { FormsModule } from '@angular/forms';  
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    HomepageComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,  
    ComponentsModule        
  ],
})
export class PagesModule {}
