import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './layouts/shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, PagesModule, AppRoutingModule, FormsModule, SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule {}