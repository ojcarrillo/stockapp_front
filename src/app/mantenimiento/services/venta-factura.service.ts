import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Venta } from '../../models/venta-factura.model';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VentaFacturaService {

  PATH = '/facturas';

  constructor(public http: HttpClient
  ) { }

  guardarVentaFactura(obj: Venta) {
    const url = URL_SERVICIOS + '/guardarVenta';
    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
