import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from '../../../models/proveedor.model';
import { MatTableDataSource } from '@angular/material/table';
import { Articulo } from 'src/app/models/articulo.model';
import { Fatura } from '../../../models/factura.model';
import { DetalleFacturProveedor } from '../../../models/detalle-factura-proveedor.model';
import { ProveedorService } from '../../../mantenimiento/services/proveedor.service';
import { ArticulosService } from '../../../mantenimiento/services/articulos.service';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../shared/app-settings.module';
import { MatDialog } from '@angular/material/dialog';
import { ListadoArticulosComponent } from '../../../components/listado-articulos/listado-articulos.component';
import { ModalService } from '../../../shared/_modal/modal.service';

@Component({
  selector: 'app-compras-proveedores',
  templateUrl: './compras-proveedores.component.html',
  styles: [
  ]
})
export class ComprasProveedoresComponent implements OnInit {

  proveedorSel = new Proveedor('', '', '', '');
  articuloSel: Articulo;
  detalleSel = new DetalleFacturProveedor();

  factura = new Fatura();
  articulos: DetalleFacturProveedor[];
  detalleSelObj: DetalleFacturProveedor;

  selectRowIndex = -1;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<DetalleFacturProveedor>();

  @ViewChild(ListadoArticulosComponent, { static: false }) listadoComponent: ListadoArticulosComponent;

  /* autocomplete - buscador articulos */
  buscadorArticulosCtrl = new FormControl();
  articulosFiltrados: any;
  isLoading = false;
  errorMsg: string;
  request = { page: '0', size: '10', filtro: `${this.buscadorArticulosCtrl.value}` };

  /* nombres de columnas y sus etiquetas */
  colsArticulos = [{
    id: 'pos',
    value: 'No.',
  }, {
    id: 'idarticulo',
    value: 'Id Artículo'
  }, {
    id: 'nombre',
    value: 'Artículo',
  }, {
    id: 'cantidad',
    value: 'Cantidad',
  }, {
    id: 'valorcompra',
    value: 'Valor Compra',
  }, {
    id: 'valorventa',
    value: 'Valor Venta',
  }, {
    id: 'bonificacion',
    value: '¿Es bonificación?'
  }
  ];


  constructor(
    private proveedorService: ProveedorService,
    private articuloService: ArticulosService,
    private http: HttpClient,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.displayedColumns = this.colsArticulos.map(x => x.id);
    this.dataSource.data = [];
    this.initBuscadorArticulos();
  }

  seleccion(obj: DetalleFacturProveedor) {
    this.selectRowIndex = obj.pos;
    this.detalleSelObj = obj;
  }

  agregar() {
    console.log('isvalid', this.detalleSel.isValid(), 'agr', this.validarDetalleAgregado().length);

    if (this.detalleSel.isValid() && this.validarDetalleAgregado().length === 0) {
      this.detalleSel.pos = this.dataSource.data.length + 1;
      this.dataSource.data.push(this.detalleSel);
      this.detalleSel = new DetalleFacturProveedor();
      this.dataSource._updateChangeSubscription();
      this.buscadorArticulosCtrl.setValue('');
    }
  }

  validarDetalleAgregado() {
    return this.dataSource.data.length > 0 ? this.dataSource.data.filter
      (item => {
        if (item.idarticulo === this.detalleSel.idarticulo
          && this.detalleSel.bonificacion === false
          && item.bonificacion === false) {
          return item;
        }
      }) : [];
  }

  retirar() {
    if (this.selectRowIndex > -1) {
      this.dataSource.data = this.dataSource.data.filter(item => item !== this.detalleSelObj);
      let pos = 1;
      this.dataSource.data.forEach(item => {
        item.pos = pos++;
      });
      this.dataSource._updateChangeSubscription();
      this.selectRowIndex = -1;
      this.detalleSelObj = undefined;
    }
  }

  buscarProveedor(filtro: string) {
    const request = { filtro: `${filtro}` };
    this.proveedorService.listarProveedores(request)
      .subscribe((resp: any) => {
        if (resp.page.totalElements === 1) {
          this.proveedorSel = resp._embedded.proveedores[0];
        }
      });
  }

  buscarArticuloById(filtro: number) {
    this.articuloService.findById(filtro)
      .subscribe((resp: any) => {
        if (resp.page.totalElements === 1) {
          this.seleccionarArticulo(resp._embedded.articulos[0]);
        }
      },
        error => { });
  }

  initBuscadorArticulos() {
    this.buscadorArticulosCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.articulosFiltrados = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(URL_SERVICIOS + '/articulos/search/filtrarArticulos',
          { params: { page: '0', size: '10', filtro: value } })
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((data: any) => {
        this.errorMsg = '';
        this.articulosFiltrados = data._embedded.articulos;
      });
  }

  seleccionarArticulo(obj: Articulo) {
    this.asignarArticuloSel(obj);
    this.closeModal('buscarArticulosMd');
  }

  asignarArticuloSel(obj: Articulo) {
    console.log(obj);

    if (obj.id === undefined) {
      return;
    }
    this.articuloSel = obj;
    this.detalleSel.idarticulo = obj.id;
    this.detalleSel.nombre = obj.nombreComercial + ' x ' + obj.presentacion.nombre;
    this.buscadorArticulosCtrl.setValue(this.detalleSel.nombre);
    this.listadoComponent.setRowIndex(-1);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
