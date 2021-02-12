import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { Unidad } from '../../models/unidad.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  PATH = '/unidades';

  constructor(
    public http: HttpClient
  ) { }

  listarUnidades(params: any) {
    const url = URL_SERVICIOS + this.PATH;
    return this.http.get(url, { params });
  }

  guardarUnidad(unidad: Unidad) {
    const url = URL_SERVICIOS + this.PATH;
    // url += '?token=' + this._usuarioService.token;
    return this.http.post(url, unidad)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );

  }

  actualizarUnidad(unidad: Unidad, id?: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.put(url, unidad)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  eliminarUnidad(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.delete(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

}
