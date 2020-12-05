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

  constructor(
  	private vendingMachine : VendingMachineService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  getMachineName() {
    this.vendingMachine.getName().then((data) => {
      const name = this.auth.web3.utils.hexToUtf8(data);
      this.machineName = name;
    }).catch((error) => {
      this.snackBar.open(
        `Error loading machine's info`,
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
  					this.getMachineName();
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
      this.getMachineName();
    }
  }

  ngOnDestroy() {
  	if (this.sub1) {
  		this.sub1.unsubscribe();
  	}
  }

}
