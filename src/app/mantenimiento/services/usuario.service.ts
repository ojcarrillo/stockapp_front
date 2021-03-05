import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../shared/app-settings.module';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  PATH = '/usuarios';

  constructor(
    public http: HttpClient
  ) { }

  listarUsuarios(params: any) {
    const url = URL_SERVICIOS + this.PATH;
    return this.http.get(url, { params });
  }

  guardarUsuario(obj: Usuario) {
    const url = URL_SERVICIOS + this.PATH;

    return this.http.post(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  actualizarUsuario(obj: Usuario, id?: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.put(url, obj)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  eliminarUsuario(id: number) {
    const url = URL_SERVICIOS + this.PATH + `/${id}`;
    return this.http.delete(url)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

}
