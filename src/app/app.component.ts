import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Vending Machine';
  walletNotFound : boolean = true;
  subscriptionAccountsChanged: any = null;
  opened: boolean = false;

  constructor(
  	private auth: AuthService,
  	private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
  	this.auth.detectMetamask().then((res) => {
  		this.walletNotFound = false;
  		if (res) {
  			// Set access to wallet accounts
  			this.auth.setAccounts().then((data) => {
  				// Set listeners for change in wallet accounts
  				if (data) {
  					this.auth.onAccountsChanged();
  				}
		  	});
  		}
  	}).catch((reason) => {
  		this.walletNotFound = true;
  		this.snackBar.open(`${reason}`, 'X', {duration: 3000});
  	});
  }

  ngOnDestroy(): void {  	
  }

  toggleSidenav(opened: boolean) {
  	this.opened = opened;
  }

  closeMenu() {
  	this.opened = false;
  }

  authIsLoading() {
  	return this.auth.loading;
  }

}
