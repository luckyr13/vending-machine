import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetectMetamaskGuard } from './../auth/detect-metamask.guard';
import { AuthGuard } from './../auth/auth.guard';

const routes: Routes = [
	{
		path: 'owner',
		canActivate: [DetectMetamaskGuard, AuthGuard],
		children: [
			{
				path: 'dashboard', component: DashboardComponent
			},
			{
				path: '', pathMatch: 'full', redirectTo: 'dashboard'
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }
