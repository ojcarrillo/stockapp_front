import { Component, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ArticulosService } from '../../mantenimiento/services/articulos.service';
import { Articulo } from '../../models/articulo.model';
import { Presentacion } from 'src/app/models/presentacion.model';
import { Unidad } from 'src/app/models/unidad.model';
import { TipoArticulo } from 'src/app/models/tipo-articulo.model';
import { Iva } from 'src/app/models/iva.model';

@Component({
  selector: 'app-listado-articulos',
  templateUrl: './listado-articulos.component.html',
  styleUrls: ['./listado-articulos.component.css']
})
export class ListadoArticulosComponent implements OnInit {

  @Input() pageSize = 10;
  @Input() verBtnEditar = false;
  @Input() verFiltro = false;
  @Output() selectArticulo: EventEmitter<Articulo> = new EventEmitter();


  /* paginacion */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Articulo>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  request = { page: '0', size: this.pageSize.toString(), filtro: '' };
  totalElements = 0;
  loading = false;
  selectRowIndex = -1;

  filtro: any;

  /* nombres de columnas y sus etiquetas */
  columnNames = [{
    id: 'id',
    value: 'Id',
  }, {
    id: 'nombreGenerico',
    value: 'Nombre Génerico',
  }, {
    id: 'nombreComercial',
    value: 'Nombre Comercial',
  }, {
    id: 'presentacion',
    value: 'Presentación',
    isObject: true
  }, {
    id: 'unidadcompra',
    value: 'Unidad de Compra',
    isObject: true
  }, {
    id: 'valorCompra',
    value: 'Valor de Compra ($)',
    isNumber: true
  }, {
    id: 'unidadventa',
    value: 'Unidad de Venta',
    isObject: true
  }, {
    id: 'valorVenta',
    value: 'Valor de Venta ($)',
    isNumber: true
  }, {
    id: 'tipoarticulo',
    value: 'Tipo de Artículo',
    isObject: true
  }, {
    id: 'iva',
    value: 'Iva',
    isObject: true
  }, {
    id: 'activo',
    value: 'Activo'
  }
  ];


  constructor(
    private service: ArticulosService
  ) { }

  ngOnInit(): void {
    this.initComponente();
  }

  initComponente() {
    this.opciones();
    this.request = { page: '0', size: this.pageSize.toString(), filtro: '' };
    this.listarArticulos(this.request);
    this.dataSource.paginator = this.paginator;
  }

  opciones() {
    if (this.verBtnEditar === true) {
      this.displayedColumns = ['opciones'].concat(this.columnNames.map(x => x.id));
    } else {
      this.displayedColumns = this.columnNames.map(x => x.id);
    }
  }

  nextPage(event: PageEvent) {
    this.request.page = event.pageIndex.toString();
    this.request.size = event.pageSize.toString();
    if (this.filtro !== undefined) {
      this.request.filtro = `${this.filtro}`;
    }
    this.listarArticulos(this.request);
  }

  private listarArticulos(request: any) {
    this.loading = true;
    this.service.listarArticulos(request)
      .subscribe((resp: any) => {
        this.totalElements = resp.page.totalElements;
        this.dataSource.data = resp._embedded.articulos;
      }, error => {
        this.loading = false;
      });
  }

  btnEditarClick(articulo: Articulo) {
    this.selectArticulo.emit(articulo);
  }

  selectRowClick(articulo: Articulo) {
    if (this.verBtnEditar === false) {
      this.selectRowIndex = articulo.id;
      this.selectArticulo.emit(articulo);
    }
  }

  limpiarFiltro() {
    this.filtro = '';
    this.request = { page: '0', size: this.pageSize.toString(), filtro: '' };
    if (this.paginator !== undefined) {
      this.paginator.pageIndex = 0;
    }
    this.selectRowIndex = -1;
    this.listarArticulos(this.request);
    this.selectArticulo.emit(new Articulo('', '', new Presentacion('', false, false), 0, 0, new Unidad('', false, false), 1,
      new Unidad('', false, false), new Iva('', 0, false, false), new TipoArticulo('', false, false), '', 0, 0, false));
  }

  onChange(filtro: string) {
    if (filtro.length > 0) {
      this.request.filtro = `${filtro}`;
      this.request.page = '0';
      this.paginator.pageIndex = 0;
      this.listarArticulos(this.request);
    } else {
      this.limpiarFiltro();
    }
  }

  actualizar() {
    this.listarArticulos(this.request);
  }
}
