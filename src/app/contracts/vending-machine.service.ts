import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VendingMachineService {
	private contract = null;
	private contractAddress: string = '0x28a69A74895EE7e4176603678Fe667284E54561d';
	private ABI = null;
	private urlABIFile = 'assets/contracts/VendingMachine.json';

  constructor(
  	private auth: AuthService,
  	private http: HttpClient
  ) { }

  setContractAddress(_address: string) {
  	this.contractAddress = _address;
  }

  setABI(): Observable<any> {
  	return this.http.get<any>(this.urlABIFile)
  		.pipe(
  			tap((abi) => {
  				this.ABI = abi;
  			}),
  			catchError(this.errorHandler)
  		);
  }

  getContractAddress() {
  	return this.contractAddress;
  }

  getABI() {
  	return this.ABI;
  }

  getContract() {
  	return this.contract;
  }

  init() {
  	if (!this.contract) {
  		this.contract = new this.auth.web3.eth.Contract(this.ABI, this.contractAddress);

  	}
  }

  getName() : Promise<any> {
  	console.log('contrato', this.contract)
  	// return this.contract.methods.name().call({from: this.auth.getMainAccount()});
    return (this.contract.methods.name().call({
      from: this.auth.getMainAccount()
    }));
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMsg = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMsg = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMsg = `Backend returned code ${JSON.stringify(error)}`;

    }
    return throwError(errorMsg);
  }
}
