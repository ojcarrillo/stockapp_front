import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Proveedor } from '../../../models/proveedor.model';
import { MatTableDataSource } from '@angular/material/table';
import { Articulo } from 'src/app/models/articulo.model';
import { Factura } from '../../../models/factura.model';
import { DetalleFacturProveedor } from '../../../models/detalle-factura-proveedor.model';
import { ProveedorService } from '../../../mantenimiento/services/proveedor.service';
import { ArticulosService } from '../../../mantenimiento/services/articulos.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { ListadoArticulosComponent } from '../../../components/listado-articulos/listado-articulos.component';
import { ModalService } from '../../../shared/_modal/modal.service';
import { FacturaService } from '../../../mantenimiento/services/factura.service';

import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings, URL_SERVICIOS } from '../../../shared/app-settings.module';

@Component({
  selector: 'app-compras-proveedores',
  templateUrl: './compras-proveedores.component.html',
  styleUrls: ['./compras-proveedores.component.css']
})
export class ComprasProveedoresComponent implements OnInit {

  ahora;

  proveedorSel = new Proveedor('', '', '', '');
  articuloSel: Articulo;
  detalleSel = new DetalleFacturProveedor();

  factura = new Factura();
  detalleSelObj: DetalleFacturProveedor;

  selectRowIndex = -1;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<DetalleFacturProveedor>();

  @ViewChild(ListadoArticulosComponent, { static: false }) listadoComponent: ListadoArticulosComponent;
  @ViewChild('idarticuloTxt') idarticuloTxt: ElementRef;

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

  public guardarForm = this.fb.group({
    nit: ['', [Validators.required]],
    numerofactura: ['', [Validators.required]],
    fechaexpedicion: ['', [Validators.required]],
    valoriva: ['', [Validators.required]],
    valortotal: ['', [Validators.required]],
    fechavencimiento: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: ModalService,
    private articuloService: ArticulosService,
    private proveedorService: ProveedorService,
    private facturaService: FacturaService) {

  }

  ngOnInit(): void {
    this.displayedColumns = this.colsArticulos.map(x => x.id);
    this.dataSource.data = [];
    this.initBuscadorArticulos();
    this.ahora = new Date().toISOString().slice(0, 10);
  }

  seleccion(obj: DetalleFacturProveedor) {
    this.selectRowIndex = obj.pos;
    this.detalleSelObj = obj;
  }

  agregar() {
    if (this.detalleSel.isValid() && this.validarDetalleAgregado().length === 0) {
      this.detalleSel.pos = this.dataSource.data.length + 1;
      this.detalleSel.idarticulo = this.articuloSel.id;
      this.detalleSel.articulo = this.articuloSel;
      this.dataSource.data.push(this.detalleSel);
      this.detalleSel = new DetalleFacturProveedor();
      this.dataSource._updateChangeSubscription();
      this.buscadorArticulosCtrl.setValue('');
      this.idarticuloTxt.nativeElement.focus();
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
          this.setFocus('numerofactura');
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
    this.setFocus('cantidad');
  }

  asignarArticuloSel(obj: Articulo) {
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

  setFocus(nombre: string) {
    window.document.getElementsByName(nombre)[0].focus();
  }

  guardar() {
    if (this.proveedorSel.id === undefined) {
      this.setFocus('nit');
      return;
    }
    if (this.factura.numeroFactura === undefined || this.factura.numeroFactura === '') {
      this.setFocus('numerofactura');
      return;
    }
    if (this.factura.fechaExpedicion === undefined || this.factura.fechaExpedicion.toString() === '') {
      this.setFocus('fechaexpedicion');
      return;
    }
    if (this.factura.valorIva === undefined || this.factura.valorIva.toString() === '') {
      this.setFocus('valoriva');
      return;
    }
    if (this.factura.valorFactura === undefined || this.factura.valorFactura.toString() === '') {
      this.setFocus('valortotal');
      return;
    }
    if (this.factura.fechaVencimiento === undefined || this.factura.fechaVencimiento.toString() === '') {
      this.setFocus('fechavencimiento');
      return;
    }
    if (this.dataSource.data.length === 0) {
      this.setFocus('idarticulo');
      return;
    }
    if (this.factura.fechaExpedicion > this.factura.fechaVencimiento) {
      this.setFocus('fechaexpedicion');
      return;
    }
    if (this.factura.fechaVencimiento < this.factura.fechaExpedicion) {
      this.setFocus('fechavencimiento');
      return;
    }
    this.factura.articulos = this.dataSource.data;
    this.factura.proveedor = this.proveedorSel;
    this.facturaService.guardarFactura(this.factura)
      .subscribe((resp: any) => {
        Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
        this.listadoComponent.actualizar();
      },
        (error: any) => {
          const errorMsg = AppSettings.SWAL_WARNING as SweetAlertOptions;
          errorMsg.text = error.error.errormsg;
          this.reset();
          Swal.fire(errorMsg);
        });
  }

  reset() {
    this.proveedorSel = new Proveedor('', '', '', '');
    this.detalleSel = new DetalleFacturProveedor();
    this.factura = new Factura();
    this.selectRowIndex = -1;
    this.dataSource.data = [];
    this.dataSource._updateChangeSubscription();
    this.detalleSelObj = undefined;
    this.articuloSel = undefined;

  }
}
