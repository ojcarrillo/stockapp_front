import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { Iva } from '../../models/iva.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IvaService {

  PATH = '/ivas';

  constructor(public http: HttpClient
  ) { }

  listarIvas(params: any) {
    const url = URL_SERVICIOS + this.PATH;
    return this.http.get(url, { params });
  }

  guardarIva(obj: Iva) {
    const url = URL_SERVICIOS + this.PATH;
    // url += '?token=' + this._usuarioService.token;
    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );

  }

  actualizarIva(obj: Iva, id?: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.put(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  eliminarIva(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.delete(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
