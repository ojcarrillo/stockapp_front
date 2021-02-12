import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { URL_SERVICIOS, AppSettings } from '../app-settings.module';
import { catchError } from 'rxjs/operators';

import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    urlsToNotUse = [
        '/login$',
    ];

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('url:', req.url, req.params);
        const obj = JSON.parse(localStorage.getItem('usuarioStockApp'));
        if (this.isValidRequestForInterceptor(req.url)) {
            const reqMod = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Accept: 'application/json',
                    Authorization: `${obj.token}`
                },
            });
            return next.handle(reqMod)
                .pipe(
                    catchError((err: HttpErrorResponse) => {
                        if (err.status === 403) {
                            console.log(err.message);
                            Swal.fire(
                                AppSettings.SWAL_REDIRECT as SweetAlertOptions
                            ).then(res => {
                                if (res.isConfirmed) {
                                    this.router.navigateByUrl('/login');
                                    return false;
                                }
                            });
                        }
                        return Observable.throw(err.statusText);
                    }));
        }
        return next.handle(req);
    }

    private isValidRequestForInterceptor(requestUrl: string): boolean {
        const positionIndicator: string = URL_SERVICIOS;
        const position = requestUrl.indexOf(positionIndicator);
        if (position > -1) {
            const destination: string = requestUrl.substr(position + positionIndicator.length);
            for (const address of this.urlsToNotUse) {
                if (new RegExp(address).test(destination)) {
                    return false;
                }
            }
        }
        return true;
    }
}
