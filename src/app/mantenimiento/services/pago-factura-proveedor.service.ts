import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { map } from 'rxjs/operators';
import { PagoFacturaProveedor } from '../../models/pago-factura-proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class PagoFacturaProveedorService {

  PATH = '/pagosfacturapoveedor';

  constructor(private http: HttpClient) { }

  guardarPago(obj: PagoFacturaProveedor) {
    const url = URL_SERVICIOS + '/guardarPagoFacturaProveedor';

    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  getTotalPagoFacturaProveedor(idproveedor: number) {
    const url = URL_SERVICIOS + `/totalPagoFacturaProveedor/${idproveedor}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  getPagosAFactura(idfactura: number) {
    const url = URL_SERVICIOS + this.PATH + `/search/filtrarByFactuta?idfactura=${idfactura}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
