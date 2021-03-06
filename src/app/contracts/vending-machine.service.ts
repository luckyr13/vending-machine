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
	private contractAddress: string = '0xB6134f8314D970d8c9Ef42d8A5575f6527540EA8';
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
    return (this.contract.methods.name().call({
      from: this.auth.getMainAccount()
    }));
  }

  getBirthdate() : Promise<any> {
    return (this.contract.methods.birthdate().call({
      from: this.auth.getMainAccount()
    }));
  }

  getTotalSales() : Promise<any> {
    return (this.contract.methods.totalSales().call({
      from: this.auth.getMainAccount()
    }));
  }

  getTopClient() : Promise<any> {
    return (this.contract.methods.topClient().call({
      from: this.auth.getMainAccount()
    }));
  }

  getActiveProducts()  : Promise<any> {
    return (this.contract.methods.getActiveProducts().call({
      from: this.auth.getMainAccount()
    }));
  }

  getProductInfo(productId) : Promise<any> {
    return (this.contract.methods.products(productId).call({
        from: this.auth.getMainAccount()
    }));
  }

  getLastCustomers(max: number)  : Promise<any> {
    return (this.contract.methods.getLastCustomers(max).call({
      from: this.auth.getMainAccount()
    }).then((customers) => {
      let new_customers = [];
      for (let c of customers) {
        if (c != '0x0000000000000000000000000000000000000000') {
          new_customers.push(c);
        }
      }
      return new_customers;
    }));
  }

  getSalesHistoryByProducts() {
    return (this.contract.methods.getSalesHistoryByProducts(this.auth.getMainAccount()).call({
      from: this.auth.getMainAccount()
    }));
  }

  getOwner()  : Promise<any> {
    return (this.contract.methods.owner().call({
      from: this.auth.getMainAccount()
    }));
  }

  async buyProduct(productId: number, quantity: number, price: number) {

    const receipt = await this.contract.methods.buyProduct(productId, quantity).send({
      from: this.auth.getMainAccount(),
      value: quantity*price,
      //gas: gas
    });

    return receipt;
  }

  createProduct(
    name: string,
    description: string,
    image: string,
    quantity: number,
    price: number
  ) {
    return (this.contract.methods.addProduct(
        name, description,
        image, quantity,
        price
      ).send({
        from: this.auth.getMainAccount(),
      }));
  }

  updateProduct(
    id: number,
    name: string,
    description: string,
    image: string,
    price: number
  ) {
    return (this.contract.methods.updateProduct(
        id,
        name, description,
        image,
        price
      ).send({
        from: this.auth.getMainAccount(),
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
