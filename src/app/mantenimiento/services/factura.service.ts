import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { map } from 'rxjs/operators';
import { Factura } from '../../models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  PATH = '/facturas';

  constructor(public http: HttpClient
  ) { }

  listarFacturas(params: any) {
    const url = URL_SERVICIOS + this.PATH;
    return this.http.get(url, { params });
  }

  guardarFactura(obj: Factura) {
    const url = URL_SERVICIOS + '/guardarFactura';
    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  listarFacturasByProveedor(params: any) {
    const url = URL_SERVICIOS + this.PATH + '/search/filtrarByProveedor';
    return this.http.get(url, { params });
  }

  findById(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/search/findById?id=${id}`;
    return this.http.get(url);
  }

  findByNumeroFactura(numeroFactura: string) {
    const url = URL_SERVICIOS + this.PATH + `/search/findByNumeroFactura?numeroFactura=${numeroFactura}`;
    return this.http.get(url);
  }
}
