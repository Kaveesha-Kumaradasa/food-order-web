import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuModalComponent } from './menu-item/menu-item.component';

@NgModule({
  declarations: [
    MenuModalComponent   
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MenuModalComponent 
  ]
})
export class ComponentsModule {}
