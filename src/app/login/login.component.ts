import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  error: string;

  constructor(private auth: AuthService, private snackBar: MatSnackBar) {
    this.loading = true;
  }

  ngOnInit(): void {
  	this.loading = false;
  }

  login() {
    this.loading = true;
    this.auth.requestAccounts().then((data) => {
      this.snackBar.open('Welcome!', 'X', {duration: 3000});
      this.loading = false;
    }).catch((reason) => {
      const msg = Object.prototype.hasOwnProperty.call(reason, 'message')
        ? reason.message : 'Connection problem';
      this.snackBar.open(`Error: ${msg}`, 'X', {duration: 3000});
      this.loading = false;
    });
  }

}
