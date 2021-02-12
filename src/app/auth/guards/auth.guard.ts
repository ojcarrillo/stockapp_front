import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private service: AuthService,
    private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (localStorage.getItem('usuarioStockApp') !== null) {
      return this.service.validarToken()
        .pipe(
          tap(autenticado => {
            if (!autenticado) {
              localStorage.removeItem('usuarioStockApp');
              this.router.navigateByUrl('/login');
            }
          })
        );
    } else {
      this.router.navigateByUrl('/login');
      return true;
    }
  }

}
