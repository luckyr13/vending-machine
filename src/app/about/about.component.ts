import { Component, OnInit, OnDestroy } from '@angular/core';
import { VendingMachineService } from '../contracts/vending-machine.service';
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	private sub1: Subscription;

  constructor(
  	private vendingMachine : VendingMachineService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  	if (!this.vendingMachine.getContract()) {
  		this.sub1 = this.vendingMachine.setABI().subscribe({
  			error: (reason) => {
  				this.snackBar.open(
  					`Error loading ABI!: ${reason}`,
  					'X',
  					{duration: 3000}
  				);
  			},
  			complete: () => {
  				// INIT CONTRACT
  				try {
  					this.vendingMachine.init();

  					this.vendingMachine.getName().then((data) => {
  						alert('Nombre obtenido ' + data);
  					}).catch((error) => {
  						this.snackBar.open(
                `Error loading machine's info`,
                'X',
                {duration: 3000}
              );
  					});
  				} catch (err) {
  					this.snackBar.open(
  						`Error loading contract: ${err}`,
  						'X',
  						{duration: 3000}
  					);
  					
  				}
  			}
  		});
  	} else {
      this.vendingMachine.getName().then((data) => {
        alert('Nombre obtenido! ' + data);
      }).catch((error) => {
        this.snackBar.open(
          `Error loading machine's info!`,
          'X',
          {duration: 3000}
        );
      });
    }
  }

  ngOnDestroy() {
  	if (this.sub1) {
  		this.sub1.unsubscribe();
  	}
  }

}
