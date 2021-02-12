import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmedValidator } from './confirmed-validator.function';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings } from '../../shared/app-settings.module';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: [
  ]
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[];
  usuarioEditar: Usuario;

  /* paginacion */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Usuario>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  request = { page: '0', size: '5' };
  totalElements = 0;
  loading = false;
  pageSize = '5';

  /* nombres de columnas y sus etiquetas */
  columnNames = [{
    id: 'id',
    value: 'No.',
  }, {
    id: 'nombre',
    value: 'Nombre',
  }, {
    id: 'documento',
    value: 'Documento',
  }, {
    id: 'telefono',
    value: 'Teléfono',
  }, {
    id: 'celular',
    value: 'Celular',
  }, {
    id: 'login',
    value: 'Login',
  }, {
    id: 'activo',
    value: 'Activo',
  }
  ];

  public guardarForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(10)]],
    documento: ['', [Validators.required, Validators.minLength(6)]],
    celular: ['', [Validators.required, Validators.minLength(10)]],
    telefono: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password2: ['', [Validators.required, Validators.minLength(8)]],
    activo: [true]
  }, {
    validator: ConfirmedValidator('password', 'password2')
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: UsuarioService
  ) { }

  ngOnInit(): void {
    this.listarUsuarios(this.request);
    this.displayedColumns = this.columnNames.map(x => x.id).concat(['opciones']);
    this.dataSource.paginator = this.paginator;
  }

  guardar() {
    if (!this.guardarForm.valid) {
      return;
    }
    let usuario: Usuario;
    usuario = this.guardarForm.getRawValue();
    usuario.login = usuario.documento.toString();
    if (this.usuarioEditar) {
      this.service.actualizarUsuario(usuario, this.usuarioEditar.id)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    } else {
      this.service.guardarUsuario(usuario)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    }
  }

  editar(usuario: Usuario) {
    Object.keys(this.guardarForm.controls).forEach(key => {
      this.guardarForm.get(key).setValue(usuario[key]);
    });
    this.usuarioEditar = usuario;
    window.scroll(0, 0);
  }

  eliminar(usuario: Usuario) {
    Swal.fire(
      AppSettings.CONFIRM_OPS as SweetAlertOptions
    ).then(result => {
      console.log(result);
      if (result.isConfirmed) {
        // this.unidades = this.unidades.filter(item => item !== unidad);
        this.service.eliminarUsuario(usuario.id)
          .subscribe(
            resp => {
              this.listarUsuarios({ page: '0', size: this.pageSize });
              this.paginator.pageIndex = 0;
              Swal.fire(AppSettings.SWAL_ELIMINADO as SweetAlertOptions);
            },
            error => {
              console.log(error);
            });
      }
    });
  }

  nextPage(event: PageEvent) {
    this.request.page = event.pageIndex.toString();
    this.request.size = event.pageSize.toString();
    this.listarUsuarios(this.request);
  }

  private listarUsuarios(request: any) {
    this.loading = true;
    this.service.listarUsuarios(request)
      .subscribe((resp: any) => {
        this.totalElements = resp.page.totalElements;
        this.dataSource.data = resp._embedded.usuarios;
      }, error => {
        this.loading = false;
      });
  }

  private actualizarVista() {
    this.listarUsuarios(this.request);
    Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
    this.guardarForm.reset();
  }

}
