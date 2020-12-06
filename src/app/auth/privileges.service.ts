import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { VendingMachineService } from './../contracts/vending-machine.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {

  constructor(
  	private auth: AuthService,
  	private vendingMachine: VendingMachineService
  ) {

  }

  currentUserIsOwner(): Promise<boolean> {
  	return this.vendingMachine.getOwner().then((owner) => {
  		if (owner == this.auth.getMainAccount()) {
  			return true;
  		} else {
  			return false;
  		}
  	});
  }
}
