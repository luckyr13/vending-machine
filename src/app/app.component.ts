import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { VendingMachineService } from './contracts/vending-machine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Vending Machine';
  walletNotFound : boolean = true;
  opened: boolean = false;
  network: string;
  mainAddress: string;


  menu = [
  	{path: 'login', label:'Sign in', icon: 'login'},
  	{path: 'products', label:'Products', icon: 'shopping_cart'},
    {path: 'orders', label:'My orders', icon: 'archive'},
  	{path: 'about', label:'About the machine', icon: 'info'},
    {path: 'owner/dashboard', label:'Owner', icon: 'admin_panel_settings'}

  ];

  constructor(
  	private auth: AuthService,
  	private snackBar: MatSnackBar,
    private vendingMachine: VendingMachineService
  ) {

  }

  ngOnInit(): void {
  	this.auth.detectMetamask().then((res) => {
  		this.walletNotFound = false;
  		if (res) {
  			// Set access to wallet accounts
  			this.auth.setAccounts().then((data) => {
          // Get main account address
          if (data && data.length) {
            this.mainAddress = this.auth.getMainAccount();
          }
  				// Set listeners for change in wallet accounts
					this.auth.onAccountsChanged();
          this.auth.onChainChanged();
				
          // Get network's name 
          this.auth.setNetworkName().then((network) => {
            this.network = network;
          }).catch((reason) => { 
            this.snackBar.open(`Error network name: ${reason}`, 'X', {duration: 3000});
          });

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
