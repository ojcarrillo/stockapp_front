import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { Presentacion } from '../../models/presentacion.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PresentacionService {

  PATH = '/presentaciones';

  constructor(public http: HttpClient
  ) { }

  listarPresentaciones(params: any) {
    const url = URL_SERVICIOS + this.PATH;
    return this.http.get(url, { params });
  }

  guardarPresentacion(obj: Presentacion) {
    const url = URL_SERVICIOS + this.PATH;

    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );

  }

  actualizarPresentacion(obj: Presentacion, id?: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.put(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  eliminarPresentacion(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.delete(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
