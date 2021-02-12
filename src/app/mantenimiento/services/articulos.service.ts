import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { map } from 'rxjs/operators';
import { Articulo } from '../../models/articulo.model';


@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  PATH = '/articulos';

  constructor(public http: HttpClient
  ) { }

  listarArticulos(params: any) {
    let url = URL_SERVICIOS + this.PATH;
    if (params.filtro !== undefined && params.filtro !== '') {
      url += '/search/filtrarArticulos';
    }
    return this.http.get(url, { params });
  }

  guardarArticulo(obj: Articulo) {
    const url = URL_SERVICIOS + '/guardarArticulo';
    // url += '?token=' + this._usuarioService.token;
    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );

  }

  actualizarArticulo(obj: Articulo, id?: number) {
    const url = URL_SERVICIOS + '/guardarArticulo';
    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  eliminarArticulo(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.delete(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  findById(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/search/findById?id=${id}`;
    return this.http.get(url);
  }
}
