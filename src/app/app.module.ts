import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DisplayProductsComponent } from './display-products/display-products.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { WalletNotFoundComponent } from './wallet-not-found/wallet-not-found.component';
import { AboutComponent } from './about/about.component';
import { OwnerModule } from './owner/owner.module';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    PageNotFoundComponent,
    DisplayProductsComponent,
    LoginComponent,
    FooterComponent,
    WalletNotFoundComponent,
    AboutComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    OwnerModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
