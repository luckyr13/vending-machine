import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { PrivilegesService } from './../../auth/privileges.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { VendingMachineService } from './../../contracts/vending-machine.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
	error: boolean = true;
	sub1: Subscription;


  constructor(
  	private auth: AuthService,
  	private privileges: PrivilegesService,
  	private snackBar: MatSnackBar,
  	private vendingMachine: VendingMachineService
  ) {

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
  					this.checkPrivileges();
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
  		this.checkPrivileges();
    }
  }

  ngOnDestroy() {
  	if (this.sub1) {
  		this.sub1.unsubscribe();
  	}
  }

  checkPrivileges() {
  	this.privileges.currentUserIsOwner().then((isOwner) => {
  		if (isOwner) {
  			this.error = false;	
  		} else {

  		}
  		this.snackBar.open(`IsOwner: ${isOwner}`, 'X', {duration: 3000});
  	}).catch((reason) => {
  		this.snackBar.open(`Error: ${reason}`, 'X', {duration: 3000});
  	});
  }

}
