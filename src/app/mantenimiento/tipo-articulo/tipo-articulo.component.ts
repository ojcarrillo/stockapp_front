import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoArticulo } from '../../models/tipo-articulo.model';

import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings } from '../../shared/app-settings.module';
import { TipoArticuloService } from '../services/tipo-articulo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tipo-articulo',
  templateUrl: './tipo-articulo.component.html',
  styles: [
  ]
})
export class TipoArticuloComponent implements OnInit {

  tipoArticulos: TipoArticulo[];

  public tipoArticuloEditar: TipoArticulo;

  /* paginacion */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<TipoArticulo>();
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
    private service: TipoArticuloService) { }

  ngOnInit(): void {
    this.listarTipoArticulos({ page: '0', size: this.pageSize });
    this.displayedColumns = this.columnNames.map(x => x.id).concat(['opciones']);
    this.dataSource.paginator = this.paginator;
  }

  guardar() {
    if (!this.guardarForm.valid) {
      return;
    }
    let tipoArticulo: TipoArticulo;
    tipoArticulo = this.guardarForm.getRawValue();
    if (this.tipoArticuloEditar) {
      this.service.actualizarTipoArticulo(tipoArticulo, this.tipoArticuloEditar.id)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    } else {
      this.service.guardarTipoArticulo(tipoArticulo)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    }
  }

  editar(tipoArticulo: TipoArticulo) {
    this.guardarForm.controls.nombre.setValue(tipoArticulo.nombre);
    this.tipoArticuloEditar = tipoArticulo;
    window.scroll(0, 0);
  }

  eliminar(tipoArticulo: TipoArticulo) {
    Swal.fire(
      AppSettings.CONFIRM_OPS as SweetAlertOptions
    ).then(result => {
      console.log(result);
      if (result.isConfirmed) {
        // this.unidades = this.unidades.filter(item => item !== unidad);
        this.service.eliminarTipoArticulo(tipoArticulo.id)
          .subscribe(
            resp => {
              this.listarTipoArticulos({ page: '0', size: this.pageSize });
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
    this.listarTipoArticulos(this.request);
  }

  private listarTipoArticulos(request: any) {
    this.loading = true;
    this.service.listarTipoArticulos(request)
      .subscribe((resp: any) => {
        this.totalElements = resp.page.totalElements;
        this.dataSource.data = resp._embedded.tipoarticulos;
      }, error => {
        this.loading = false;
      });
  }

  private actualizarVista() {
    this.listarTipoArticulos(this.request);
    Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
    this.guardarForm.reset();
    this.tipoArticuloEditar = null;
  }
}
