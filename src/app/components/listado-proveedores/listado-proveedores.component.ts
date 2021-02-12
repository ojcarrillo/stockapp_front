import { Component, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { Proveedor } from '../../models/proveedor.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProveedorService } from '../../mantenimiento/services/proveedor.service';


@Component({
  selector: 'app-listado-proveedores',
  templateUrl: './listado-proveedores.component.html',
  styles: [
  ]
})
export class ListadoProveedoresComponent implements OnInit {

  @Input() pageSize = 5;
  @Output() selectProveedor: EventEmitter<Proveedor> = new EventEmitter();

  proveedores: Proveedor[];
  filtroProveedor: any;
  sriProvedores: -1;

  /* paginacion proveedores */
  colsProveedores: string[];
  dsProveedores = new MatTableDataSource<Proveedor>();
  @ViewChild(MatPaginator, { static: false }) pgProveedores: MatPaginator;

  request = { page: '0', size: '5', filtro: '' };
  totalElements = 0;
  loading = false;
  pageIndex = 0;

  /* nombres de columnas y sus etiquetas */
  colnamProveedores = [{
    id: 'id',
    value: 'No.',
  }, {
    id: 'nombre',
    value: 'Nombre',
  }, {
    id: 'nit',
    value: 'Nit',
  }
  ];

  constructor(
    private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.initProveedores();
  }

  initProveedores() {
    this.request = { page: '0', size: this.pageSize.toString(), filtro: '' };
    this.listarProveedores(this.request);
    this.colsProveedores = this.colnamProveedores.map(x => x.id);
    this.dsProveedores.paginator = this.pgProveedores;
  }

  srProveedores(row: any) {
    this.sriProvedores = row.id;
    this.selectProveedor.emit(row as Proveedor);
  }

  npProveedores(event: PageEvent) {
    this.request.page = event.pageIndex.toString();
    this.request.size = event.pageSize.toString();
    if (this.filtroProveedor !== undefined) {
      this.request.filtro = `${this.filtroProveedor}`;
    }
    this.listarProveedores(this.request);
  }

  onChangeProveedores(filtro: string) {
    if (filtro.length > 0) {
      this.request.filtro = `${filtro}`;
      this.request.page = '0';
      this.pgProveedores.pageIndex = 0;
      this.listarProveedores(this.request);
    } else {
      this.limpiarFiltroProveedores();
    }
  }

  limpiarFiltroProveedores() {
    this.filtroProveedor = '';
    this.request = { page: '0', size: this.pageSize.toString(), filtro: '' };
    if (this.pgProveedores !== undefined) {
      this.pgProveedores.pageIndex = 0;
    }
    this.sriProvedores = -1;
    this.listarProveedores(this.request);
    this.selectProveedor.emit(new Proveedor('', '', '', ''));
  }

  private listarProveedores(request: any) {
    this.loading = true;
    this.proveedorService.listarProveedores(request)
      .subscribe((resp: any) => {
        this.totalElements = resp.page.totalElements;
        this.dsProveedores.data = resp._embedded.proveedores;
      }, error => {
        this.loading = false;
      });
  }

}
