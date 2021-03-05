import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { TipoArticulo } from '../../models/tipo-articulo.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoArticuloService {

  PATH = '/tipoarticulos';

  constructor(public http: HttpClient
  ) { }

  listarTipoArticulos(params: any) {
    const url = URL_SERVICIOS + this.PATH;
    return this.http.get(url, { params });
  }

  guardarTipoArticulo(obj: TipoArticulo) {
    const url = URL_SERVICIOS + this.PATH;

    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );

  }

  actualizarTipoArticulo(obj: TipoArticulo, id?: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.put(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  eliminarTipoArticulo(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.delete(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
