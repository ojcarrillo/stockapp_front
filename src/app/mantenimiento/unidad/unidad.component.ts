import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings } from '../../shared/app-settings.module';
import { Unidad } from '../../models/unidad.model';
import { UnidadService } from '../services/unidad.service';

import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styles: [
  ]
})
export class UnidadComponent implements OnInit {

  unidades: Unidad[];

  public unidadEditar: Unidad;

  /* paginacion */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Unidad>();
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
    private service: UnidadService) { }

  ngOnInit(): void {
    this.listarUnidades({ page: '0', size: this.pageSize });
    this.displayedColumns = this.columnNames.map(x => x.id).concat(['opciones']);
    this.dataSource.paginator = this.paginator;
  }

  guardar() {
    if (!this.guardarForm.valid) {
      return;
    }
    let unidad: Unidad;
    unidad = this.guardarForm.getRawValue();
    if (this.unidadEditar) {
      this.service.actualizarUnidad(unidad, this.unidadEditar.id)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    } else {
      this.service.guardarUnidad(unidad)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    }
  }

  editar(unidad: Unidad) {
    this.guardarForm.controls.nombre.setValue(unidad.nombre);
    this.unidadEditar = unidad;
    window.scroll(0, 0);
  }

  eliminar(unidad: Unidad) {
    Swal.fire(
      AppSettings.CONFIRM_OPS as SweetAlertOptions
    ).then(result => {
      console.log(result);
      if (result.isConfirmed) {
        // this.unidades = this.unidades.filter(item => item !== unidad);
        this.service.eliminarUnidad(unidad.id)
          .subscribe(
            resp => {
              this.listarUnidades({ page: '0', size: this.pageSize });
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
    this.listarUnidades(this.request);
  }

  private listarUnidades(request: any) {
    this.loading = true;
    this.service.listarUnidades(request)
      .subscribe((resp: any) => {
        this.unidades = resp._embedded.unidades;
        this.totalElements = resp.page.totalElements;
        // this.dataSource = new MatTableDataSource<Unidad>(this.unidades);
        this.dataSource.data = this.unidades;
      }, error => {
        this.loading = false;
      });
  }

  private actualizarVista() {
    this.listarUnidades(this.request);
    Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
    this.guardarForm.reset();
    this.unidadEditar = null;
  }
}
