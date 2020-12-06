import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WalletNotFoundComponent } from './wallet-not-found/wallet-not-found.component';
import { DisplayProductsComponent } from './display-products/display-products.component';
import { LoginComponent } from './login/login.component';
import { DetectMetamaskGuard } from './auth/detect-metamask.guard';
import { AuthGuard } from './auth/auth.guard';
import { AboutComponent } from './about/about.component';
import { OrdersComponent } from './orders/orders.component';

const routes : Routes = [
	{
		path: 'products', component: DisplayProductsComponent,
		canActivate: [DetectMetamaskGuard, AuthGuard]
	},
	{
		path: 'orders', component: OrdersComponent,
		canActivate: [DetectMetamaskGuard, AuthGuard]
	},
	{
		path: 'about', component: AboutComponent,
		canActivate: [DetectMetamaskGuard]
	},
	{
		path: 'login', component: LoginComponent,
		canActivate: [DetectMetamaskGuard]
	},
	{
		path: 'wallet-not-found', component: WalletNotFoundComponent
	},
	{
		path: '',   redirectTo: '/login', pathMatch: 'full'
	},
	{
		path: '**', component: PageNotFoundComponent
	}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
