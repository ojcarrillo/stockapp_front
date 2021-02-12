import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { map } from 'rxjs/operators';
import { DatosPrograma } from '../../models/datos-programa.model';

@Injectable({
  providedIn: 'root'
})
export class DatosProgramaService {

  PATH = '/datosprograma';

  constructor(public http: HttpClient
  ) { }

  consultarDatosPrograma() {
    const url = URL_SERVICIOS + this.PATH + '/1';
    return this.http.get(url);
  }

  actualizarDatosPrograma(obj: DatosPrograma) {
    const url = URL_SERVICIOS + this.PATH + '/1';
    return this.http.put(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }
}
