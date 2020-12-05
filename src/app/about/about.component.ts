import { Component, OnInit, OnDestroy } from '@angular/core';
import { VendingMachineService } from '../contracts/vending-machine.service';
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	private sub1: Subscription;
  public machineName: string;
  public error: boolean = false;
  public machineAgeInSeconds: number;
  public birthdate: string;
  public owner: string;
  public contractAddress: string;
  public topClient: string;
  public totalSales: number;
  public lastCustomers: string[];

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

  getOwner() {
    this.vendingMachine.getOwner().then((owner) => {
      this.owner = owner;
    }).catch((error) => {
      console.error('getOwner');
    });
  }

  getTopClient() {
    this.vendingMachine.getTopClient().then((topClient) => {
      this.topClient = topClient;
    }).catch((error) => {
      console.error('getTopClient');
    });
  }

  getTotalSales() {
    this.vendingMachine.getTotalSales().then((total) => {
      this.totalSales = total;
    }).catch((error) => {
      console.error('getTotalSales');
    });
  }

  getMachineAge() {
    this.vendingMachine.getBirthdate().then((birthdate) => {
      const birth = new Date(birthdate * 1000);
      const today = new Date();
      const todayInSeconds = today.getTime() / 1000;

      this.birthdate = birth.toLocaleDateString();
      this.machineAgeInSeconds = todayInSeconds - birthdate;

    }).catch((error) => {
      console.error('getMachineAge');
      
    });
  }

  getLastCustomers(max: number) {
    this.vendingMachine.getLastCustomers(max).then((customers) => {
      this.lastCustomers = customers;

    }).catch((error) => {
      console.error('getLastCustomers');
      
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
    this.contractAddress = this.vendingMachine.getContractAddress();
    this.getMachineName();
    this.getMachineAge();
    this.getOwner();
    this.getTopClient();
    this.getTotalSales();
    this.getLastCustomers(20);
  }

  ngOnDestroy() {
  	if (this.sub1) {
  		this.sub1.unsubscribe();
  	}
  }

}
