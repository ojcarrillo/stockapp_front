import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from '../../models/proveedor.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  PATH = '/proveedores';

  constructor(public http: HttpClient
  ) { }

  listarProveedores(params: any) {
    let url = URL_SERVICIOS + this.PATH;
    if (params.filtro !== undefined && params.filtro !== '') {
      url += '/search/filtrarProveedores';
    }
    return this.http.get(url, { params });
  }

  guardarProveedor(obj: Proveedor) {
    const url = URL_SERVICIOS + this.PATH;

    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );

  }

  actualizarProveedor(obj: Proveedor, id?: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.put(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  eliminarProveedor(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.delete(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
