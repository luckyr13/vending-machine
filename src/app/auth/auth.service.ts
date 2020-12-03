import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	provider: any = null;
	web3: any = null;
	accounts: string[];
	public loading: boolean = false;

  constructor() { }

  async detectMetamask(router: Router) {
  	this.loading = true;
  	try {
  		this.provider = await detectEthereumProvider();
  	} catch (err) {
  		console.error(`ERRdetectMetamask: ${err}`);
  	}
  	this.loading = false;
		if (this.provider) {
		  // From now on, this should always be true:
		  // provider === window.ethereum
		  console.log('Wallet provider found!');
		  this.web3 = new Web3(this.provider);
		  return true;
		} else {
		  // if the provider is not detected, detectEthereumProvider resolves to null
		  console.error('Please install MetaMask!');
		  router.navigate(['wallet-not-found']);
		}
		return false;
  }

  async requestAccounts() {
  	this.loading = true;
  	try {
			this.accounts = await this.web3.eth.requestAccounts();
  		this.loading = false;
  	} catch (err) {
  		this.loading = false;
  		const msg = Object.prototype.hasOwnProperty.call(err, 'message')
        ? err.message : 'Connection problem';
        
  		throw Error(`ERRrequestAccounts: ${msg}`);
  	}
		return this.accounts;
	}
}
