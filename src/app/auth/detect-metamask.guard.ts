import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DetectMetamaskGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (this.auth.detectMetamask().then((res) => {
    	if (!res) {
    		this.router.navigate(['wallet-not-found']);
    	}
    	return res;
    }).catch((reason) => {
    	this.router.navigate(['wallet-not-found']);
    	console.error(`ERRACTIVATION: ${reason}`);
      return false;
    }));
  }
  
}
