import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WalletNotFoundComponent } from './wallet-not-found/wallet-not-found.component';
import { DisplayProductsComponent } from './display-products/display-products.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes : Routes = [
	{
		path: 'products', component: DisplayProductsComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'login', component: LoginComponent,
		canActivate: [AuthGuard]
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
