import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
	@Input() title: string;
	@Input() walletNotFound: boolean = true;
  @Output() openEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() opened: boolean;

  constructor(
  	private auth: AuthService,
  	private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
  	
  }

  isLoggedIn() {
  	return !!this.auth.getMainAccount();
  }

  toggleMenu() {
    this.openEvent.emit( !this.opened );
  }

  login() {
    
    this.auth.requestAccounts().then((accounts) => {
      this.snackBar.open('Welcome!', 'X', {duration: 3000});
    }).catch((reason) => {
      const msg = Object.prototype.hasOwnProperty.call(reason, 'message')
        ? reason.message : 'Connection problem';
      this.snackBar.open(`Error: ${msg}`, 'X', {duration: 3000});
    });
  }

  logout() {
  	this.auth.logout();
  }

}
