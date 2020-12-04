import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  error: string;

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loading = true;
  }

  isLoggedIn() {
    return !!this.auth.getMainAccount();
  }

  ngOnInit(): void {
  	this.loading = false;
  }

  login() {
    this.loading = true;
    this.auth.requestAccounts().then((accounts) => {
      this.snackBar.open('Welcome!', 'X', {duration: 3000});
      // this.loading = false;
      // this.router.navigate(['products']);
    }).catch((reason) => {
      const msg = Object.prototype.hasOwnProperty.call(reason, 'message')
        ? reason.message : 'Connection problem';
      this.snackBar.open(`Error: ${msg}`, 'X', {duration: 3000});
      this.loading = false;
    });
  }

}
