import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from '../../models/proveedor.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings } from '../../shared/app-settings.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProveedorService } from '../services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styles: [
  ]
})
export class ProveedorComponent implements OnInit {

  proveedores: Proveedor[];

  proveedorEditar: Proveedor;

  /* paginacion */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Proveedor>();
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
    id: 'nit',
    value: 'Nit',
  }, {
    id: 'direccion',
    value: 'Dirección',
  }, {
    id: 'telefono',
    value: 'Teléfono',
  }, {
    id: 'activo',
    value: 'Activo',
  }
  ];

  public guardarForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4)]],
    nit: ['', [Validators.required, Validators.minLength(6)]],
    direccion: ['', [Validators.required, Validators.minLength(10)]],
    telefono: ['', [Validators.required, Validators.minLength(6)]],
    activo: [true]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: ProveedorService
  ) { }

  ngOnInit(): void {
    this.listarProveedores(this.request);
    this.displayedColumns = this.columnNames.map(x => x.id).concat(['opciones']);
    this.dataSource.paginator = this.paginator;
  }

  guardar() {
    if (!this.guardarForm.valid) {
      return;
    }
    let proveedor: Proveedor;
    proveedor = this.guardarForm.getRawValue();
    if (this.proveedorEditar) {
      this.service.actualizarProveedor(proveedor, this.proveedorEditar.id)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    } else {
      this.service.guardarProveedor(proveedor)
        .subscribe(
          (resp: any) => {
            this.actualizarVista();
          },
          error => {
            console.log('error :: ', error);
          });
    }
  }

  editar(proveedor: Proveedor) {
    Object.keys(this.guardarForm.controls).forEach(key => {
      this.guardarForm.get(key).setValue(proveedor[key]);
    });
    this.proveedorEditar = proveedor;
    window.scroll(0, 0);
  }

  eliminar(proveedor: Proveedor) {
    Swal.fire(
      AppSettings.CONFIRM_OPS as SweetAlertOptions
    ).then(result => {
      console.log(result);
      if (result.isConfirmed) {
        // this.unidades = this.unidades.filter(item => item !== unidad);
        this.service.eliminarProveedor(proveedor.id)
          .subscribe(
            resp => {
              this.listarProveedores({ page: '0', size: this.pageSize });
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
    this.listarProveedores(this.request);
  }

  private listarProveedores(request: any) {
    this.loading = true;
    this.service.listarProveedores(request)
      .subscribe((resp: any) => {
        this.totalElements = resp.page.totalElements;
        this.dataSource.data = resp._embedded.proveedores;
      }, error => {
        this.loading = false;
      });
  }

  private actualizarVista() {
    this.listarProveedores(this.request);
    Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
    this.guardarForm.reset();
    this.proveedorEditar = null;
  }
}
