import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VendingMachineService } from '../contracts/vending-machine.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
declare const window: any;

@Component({
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
	private sub1: Subscription;
  public machineName: string;
  public error: boolean = false;
  public products = [];
  public loading: boolean;
  private prizes = {
  	1: './assets/download/killerburger.pdf',
  	2: './assets/download/martinsgrimoire.pdf',
  	3: './assets/download/tom.pdf',
  }

  constructor(
  	private vendingMachine : VendingMachineService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { 
      
  }

  getSalesHistoryByProducts() {
    this.loading = true;
    this.vendingMachine.getSalesHistoryByProducts().then((data) => {
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
    this.getSalesHistoryByProducts();
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

  downloadProduct(id) {
  	const prize = this.prizes[id];

  	if (prize) {
  		window.location.href = prize;
  	}
  }

}
