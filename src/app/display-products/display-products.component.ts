import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VendingMachineService } from '../contracts/vending-machine.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.scss']
})
export class DisplayProductsComponent implements OnInit {
	private sub1: Subscription;
  public machineName: string;
  public error: boolean = false;
  public products = [];
  public loading: boolean;
  public loadingTransaction: boolean = false;

  constructor(
  	private vendingMachine : VendingMachineService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { 
      
  }

  getProductsList() {
    this.loading = true;
    this.vendingMachine.getActiveProducts().then((data) => {
      // Iterate over products array
      for (let id of data) {
        this.vendingMachine.getProductInfo(id).then((data) => {
          data.id = id;
          data.name = this.auth.web3.utils.hexToUtf8(data.name);
          data.description = this.auth.web3.utils.hexToUtf8(data.description);
          data.image = String.prototype.trim.call(
            this.auth.web3.utils.hexToUtf8(data.image)
          );
          data.image = `./assets/img/${data.image}`;
          data.price = this.auth.web3.utils.fromWei(data.price);
          this.products.push(data);

        }).catch((error) => {
          this.snackBar.open(
            `Error loading product ${id}`,
            'X',
            {duration: 3000}
          );
          this.error = true;
        });
      }
      
      this.loading = false;
    }).catch((error) => {
      this.snackBar.open(
        `Error loading product's list`,
        'X',
        {duration: 3000}
      );
      this.error = true;
    });
  }

  ngOnInit(): void {
  	if (!this.vendingMachine.getContract()) {
  		this.sub1 = this.vendingMachine.setABI().subscribe({
  			error: (reason) => {
  				this.snackBar.open(
  					`Error loading ABI!: ${reason}`,
  					'X',
  					{duration: 3000}
  				);
          this.error = true;
  			},
  			complete: () => {
  				// INIT CONTRACT
  				try {
  					this.vendingMachine.init();
  					this.getInitialData();
  				} catch (err) {
  					this.snackBar.open(
  						`Error loading contract: ${err}`,
  						'X',
  						{duration: 3000}
  					);
            this.error = true;
  					
  				}
  			}
  		});
  	} else {
      this.getInitialData();
    }
  }

  getInitialData() {
    this.getProductsList();
    // Listeners 
    this.vendingMachine.getContract().events.NewSale({}, (error, event) => {
      let customer = '';
      if (event && event.returnValues) {
        customer = event.returnValues._customer;
      }
        this.snackBar.open(
          `New sale confirmed! Customer: ${customer}`,
          'X',
          {duration: 4000}
        );
    });
  }

  ngOnDestroy() {
  	if (this.sub1) {
  		this.sub1.unsubscribe();
  	}
  }

  async buyProduct(id, price) {
    price = this.auth.web3.utils.toWei(price);
    this.loadingTransaction = true;
    try {
      const receipt = await this.vendingMachine.buyProduct(id, 1, price);
      this.snackBar.open(
        `Transaction created: ${JSON.stringify(receipt)}`,
        'X',
        {duration: 3000}
      );
      this.loadingTransaction = false;

    } catch (err) {
      this.snackBar.open(
        `Error buyProduct: ${JSON.stringify(err)}`,
        'X',
        {duration: 3000}
      );
      this.loadingTransaction = false;
    }
  }

}
