import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.setAccounts().then((data) => {
    	console.log('Accounts: ' + JSON.stringify(data));
    	if (data && data.length) {
    		return true;
    	}
    	this.router.navigate(['login']);
    	return false;
    }).catch((reason) => {
    	console.error('Error: ' + reason);
    	this.router.navigate(['login']);
    	return false;
    });
  }
  
}
