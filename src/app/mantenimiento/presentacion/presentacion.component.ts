import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../shared/app-settings.module';

import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Presentacion } from '../../models/presentacion.model';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { PresentacionService } from '../services/presentacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styles: [
  ]
})
export class PresentacionComponent implements OnInit {

  presentaciones: Presentacion[];

  public presentacionEditar: Presentacion;

  /* paginacion */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Presentacion>();
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
  }
  ];

  public guardarForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4)]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: PresentacionService) { }

  ngOnInit(): void {
    this.listarPresentaciones(this.request);
    this.displayedColumns = this.columnNames.map(x => x.id).concat(['opciones']);
    this.dataSource.paginator = this.paginator;
  }

  guardar() {
    if (!this.guardarForm.valid) {
      return;
    }
    let presentacion: Presentacion;
    presentacion = this.guardarForm.getRawValue();
    if (this.presentacionEditar) {
      this.service.actualizarPresentacion(presentacion, this.presentacionEditar.id)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    } else {
      this.service.guardarPresentacion(presentacion)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    }
  }

  editar(presentacion: Presentacion) {
    this.guardarForm.controls.nombre.setValue(presentacion.nombre);
    this.presentacionEditar = presentacion;
    window.scroll(0, 0);
  }

  eliminar(presentacion: Presentacion) {
    Swal.fire(
      AppSettings.CONFIRM_OPS as SweetAlertOptions
    ).then(result => {
      console.log(result);
      if (result.isConfirmed) {
        // this.unidades = this.unidades.filter(item => item !== unidad);
        this.service.eliminarPresentacion(presentacion.id)
          .subscribe(
            resp => {
              this.listarPresentaciones({ page: '0', size: this.pageSize });
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
    this.listarPresentaciones(this.request);
  }

  private listarPresentaciones(request: any) {
    this.loading = true;
    this.service.listarPresentaciones(request)
      .subscribe((resp: any) => {
        this.totalElements = resp.page.totalElements;
        this.dataSource.data = resp._embedded.presentaciones;
      }, error => {
        this.loading = false;
      });
  }

  private actualizarVista() {
    this.listarPresentaciones(this.request);
    Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
    this.guardarForm.reset();
    this.presentacionEditar = null;
  }
}
