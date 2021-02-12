import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings } from '../../shared/app-settings.module';
import { Iva } from '../../models/iva.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IvaService } from '../services/iva.service';

@Component({
  selector: 'app-iva',
  templateUrl: './iva.component.html',
  styleUrls: ['./iva.component.css']
})
export class IvaComponent implements OnInit {

  ivas: Iva[];

  public ivaEditar: Iva;

  /* paginacion */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Iva>();
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
    id: 'porcentaje',
    value: 'Porcentaje (%)',
    isNumber: true
  }
  ];

  public guardarForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4)]],
    porcentaje: ['', [Validators.required]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: IvaService
  ) { }

  ngOnInit(): void {
    this.listarIvas(this.request);
    this.displayedColumns = this.columnNames.map(x => x.id).concat(['opciones']);
    this.dataSource.paginator = this.paginator;
  }

  guardar() {
    if (!this.guardarForm.valid) {
      return;
    }
    let iva: Iva;
    iva = this.guardarForm.getRawValue();
    if (this.ivaEditar) {
      this.service.actualizarIva(iva, this.ivaEditar.id)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    } else {
      this.service.guardarIva(iva)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    }
  }

  editar(iva: Iva) {
    this.guardarForm.controls.nombre.setValue(iva.nombre);
    this.guardarForm.controls.porcentaje.setValue(iva.porcentaje);
    this.ivaEditar = iva;
    window.scroll(0, 0);
  }

  eliminar(iva: Iva) {
    Swal.fire(
      AppSettings.CONFIRM_OPS as SweetAlertOptions
    ).then(result => {
      console.log(result);
      if (result.isConfirmed) {
        // this.unidades = this.unidades.filter(item => item !== unidad);
        this.service.eliminarIva(iva.id)
          .subscribe(
            resp => {
              this.listarIvas({ page: '0', size: this.pageSize });
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
    this.listarIvas(this.request);
  }

  private listarIvas(request: any) {
    this.loading = true;
    this.service.listarIvas(request)
      .subscribe((resp: any) => {
        this.totalElements = resp.page.totalElements;
        this.dataSource.data = resp._embedded.ivas;
      }, error => {
        this.loading = false;
      });
  }

  private actualizarVista() {
    this.listarIvas(this.request);
    Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
    this.guardarForm.reset();
    this.ivaEditar = null;
  }
}
