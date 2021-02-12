import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(obj: any) {
    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          localStorage.setItem('usuarioStockApp', JSON.stringify(resp));
          return resp;
        })
      );
  }

  validarToken(): Observable<boolean> {
    const url = URL_SERVICIOS + '/validarToken';
    return this.http.get(url)
      .pipe(
        tap((resp: any) => {
          this.actualizarToken(resp);
        }),
        map(reps => true),
        catchError(error => of(false))
      );
  }

  logout() {
    localStorage.removeItem('usuarioStockApp');
  }

  actualizarToken(resp: any) {
    const obj = JSON.parse(localStorage.getItem('usuarioStockApp'));
    obj.token = resp.token;
    localStorage.setItem('usuarioStockApp', JSON.stringify(obj));
  }
}
