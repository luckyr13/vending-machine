import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private provider: any = null;
	public web3: any = null;
	private accounts: string[];
	public loading: boolean = false;

  constructor() { }

  async detectMetamask(): Promise<boolean> {
    if (this.provider && this.web3) {
      return true;
    }

  	this.loading = true;
  	try {
  		this.provider = await detectEthereumProvider();
  	} catch (err) {
  		throw Error(`ERRdetectMetamask: ${err}`);
  	}
  	this.loading = false;
		if (this.provider) {
		  // From now on, this should always be true:
		  // provider === window.ethereum
      if (this.provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
        return false;
      } else {
        console.log('Wallet provider found!');
      }
		  this.web3 = new Web3(this.provider);
		  return true;
		} else {
		  // if the provider is not detected, detectEthereumProvider resolves to null
		  throw Error('Please install MetaMask!');
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

  async setAccounts(): Promise<string[]> {
    this.loading = true;
    try {
      this.accounts = await this.web3.eth.getAccounts();
      this.loading = false;
    } catch (err) {
      this.loading = false;
      const msg = Object.prototype.hasOwnProperty.call(err, 'message')
        ? err.message : 'Connection problem';
        
      throw Error(`ERRsetAccounts: ${msg}`);
    }

    return this.accounts;
  }

  getAccounts(): string[] {
    return this.accounts;
  }

  public getMainAccount(): string {
    if (this.accounts && this.accounts[0]) {
      return this.accounts[0];
    }
    return null;
  }

  /*
  *  It doesn't work
  */
  logout() {
    if (this.provider && this.provider.close) {
      this.provider.close();
    }
    if (this.web3 && this.web3.close) {
      this.web3.close();
    }
  }

  onAccountsChanged() {
    this.provider.on('accountsChanged', (data) => {
      window.location.reload();
    });
  }

  onChainChanged() {
    this.provider.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have a very good reason not to.
      window.location.reload();
    });
  }


}
