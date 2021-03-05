import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { Articulo } from 'src/app/models/articulo.model';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../../../shared/_modal/modal.service';
import { ArticulosService } from '../../../mantenimiento/services/articulos.service';
import { ListadoArticulosComponent } from '../../../components/listado-articulos/listado-articulos.component';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Venta } from '../../../models/venta-factura.model';
import { DetalleVentaFactura } from '../../../models/detalle-venta-factura.model';

import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings, URL_SERVICIOS } from '../../../shared/app-settings.module';
import { VentaFacturaService } from '../../../mantenimiento/services/venta-factura.service';
import { PagoFactura } from '../../../models/pago-factura.model';

@Component({
  selector: 'app-venta-factura',
  templateUrl: './venta-factura.component.html',
  styleUrls: ['./venta-factura.component.css']
})
export class VentaFacturaComponent implements OnInit {

  ahora;
  pago;
  errorPago;

  @ViewChild(ListadoArticulosComponent, { static: false }) listadoComponent: ListadoArticulosComponent;
  @ViewChild('idarticuloTxt') idarticuloTxt: ElementRef;

  /* autocomplete - buscador articulos */
  buscadorArticulosCtrl = new FormControl();
  articulosFiltrados: any;
  isLoading = false;
  errorMsg: string;
  request = { page: '0', size: '10', filtro: `${this.buscadorArticulosCtrl.value}` };
  articuloSel: Articulo;
  ventaSel = new Venta();
  detalleSel = new DetalleVentaFactura();
  detalleSelObj: DetalleVentaFactura;
  cantidadCtrl = new FormControl();
  pagoSel = new PagoFactura();

  /* tabla detalle articulos */
  dataSource = new MatTableDataSource<DetalleVentaFactura>();
  selectRowIndex = -1;
  displayedColumns: string[];

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
    id: 'valorUnitario',
    value: 'Valor Unidad',
  }, {
    id: 'valorIva',
    value: 'Iva',
  }, {
    id: 'valorBase',
    value: 'Base'
  }, {
    id: 'valorExentoArticulo',
    value: 'Exento'
  }, {
    id: 'valorArticulo',
    value: 'Valor Total'
  }
  ];


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: ModalService,
    private articuloService: ArticulosService,
    private ventaService: VentaFacturaService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.colsArticulos.map(x => x.id);
    this.dataSource.data = [];
    this.initBuscadorArticulos();
    this.initCantidadFC();
    this.ahora = new Date().toISOString().slice(0, 10);
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

  initCantidadFC() {
    this.cantidadCtrl.valueChanges.pipe(
      debounceTime(600)
    ).subscribe(value => {
      if (value === '') {
        return;
      } else {
        this.asignarValoresDetalle(value);
      }
    });
  }

  asignarValoresDetalle(value: number) {
    if (this.articuloSel !== undefined) {
      this.detalleSel.valorUnitario = this.articuloSel.valorVenta;
      this.detalleSel.valorArticulo = value * this.articuloSel.valorVenta;
      this.detalleSel.valorIva =
        parseFloat(((this.detalleSel.valorArticulo / (100 + this.articuloSel.iva.porcentaje))
          * this.articuloSel.iva.porcentaje).toFixed(2));
      if (this.detalleSel.valorIva !== 0) {
        this.detalleSel.valorBase = this.detalleSel.valorArticulo - this.detalleSel.valorIva;
        this.detalleSel.valorExentoArticulo = 0;
      } else {
        this.detalleSel.valorExentoArticulo = this.detalleSel.valorArticulo;
        this.detalleSel.valorBase = 0;
      }
    }
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

  seleccionarArticulo(obj: Articulo) {
    this.asignarArticuloSel(obj);
    this.closeModal('ventas-factura:buscarArticulosMd');
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

  seleccion(obj: DetalleVentaFactura) {
    this.selectRowIndex = obj.pos;
    this.detalleSelObj = obj;
  }

  agregar() {
    if (this.detalleSel.isValid() && this.validarDetalleAgregado().length === 0) {
      this.detalleSel.pos = this.dataSource.data.length + 1;
      this.detalleSel.idarticulo = this.articuloSel.id;
      this.detalleSel.articulo = this.articuloSel;
      this.dataSource.data.push(this.detalleSel);
      this.detalleSel = new DetalleVentaFactura();
      this.cantidadCtrl.setValue(null);
      this.dataSource._updateChangeSubscription();
      this.buscadorArticulosCtrl.setValue('');
      this.articuloSel = undefined;
      this.calcularValoresTotales();
      this.idarticuloTxt.nativeElement.focus();
    }
  }

  validarDetalleAgregado() {
    return this.dataSource.data.length > 0 ? this.dataSource.data.filter
      (item => {
        if (item.idarticulo === this.detalleSel.idarticulo) {
          return item;
        }
      }) : [];
  }

  calcularValoresTotales() {
    let valorTotal = 0;
    let valorExcento = 0;
    let valorIva = 0;
    let valorBase = 0;
    this.dataSource.data.forEach(obj => {
      valorTotal += obj.valorArticulo;
      valorExcento += obj.valorExentoArticulo;
      valorIva += obj.valorIva;
      valorBase += obj.valorBase;
    });
    this.ventaSel.valorFactura = valorTotal;
    this.ventaSel.valorIva = valorIva;
    this.ventaSel.baseFactura = valorBase;
    this.ventaSel.exentoFactura = valorExcento;
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
      this.detalleSel = new DetalleVentaFactura();
      this.calcularValoresTotales();
    }
  }

  reset() {
    this.detalleSel = new DetalleVentaFactura();
    this.ventaSel = new Venta();
    this.selectRowIndex = -1;
    this.dataSource.data = [];
    this.dataSource._updateChangeSubscription();
    this.detalleSelObj = undefined;
    this.articuloSel = undefined;
    this.pagoSel = new PagoFactura();
    this.pago = undefined;
    this.errorPago = undefined;
  }

  guardar() {
    if (this.ventaSel.comprador === undefined || this.ventaSel.comprador === '') {
      this.setFocus('comprador');
      return;
    }
    if (this.ventaSel.documentoComprador === undefined || this.ventaSel.documentoComprador === '') {
      this.setFocus('documentoComprador');
      return;
    }
    if (this.dataSource.data.length === 0) {
      alert('No hay artículos agregados a la factura de venta');
      return;
    }
    this.ventaSel.articulos = this.dataSource.data;
    this.ventaSel.pago = this.pagoSel;
    this.ventaService.guardarVentaFactura(this.ventaSel)
      .subscribe((resp: any) => {
        Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
        this.listadoComponent.actualizar();
        this.reset();
      },
        (error: any) => {
          const errorMsg = AppSettings.SWAL_WARNING as SweetAlertOptions;
          errorMsg.text = error.error.errormsg;
          Swal.fire(errorMsg);
        });
  }

  @HostListener('document:keydown.f10')
  abrirModalPago() {
    this.openModal('ventas-factura:pagarMd');
    setTimeout(() => {
      this.setFocus('pago');
    }, 600);
    return false;
  }

  pagar(valorPagado: number) {
    this.errorPago = undefined;
    if (valorPagado === undefined || valorPagado === 0) {
      this.errorPago = 'El valor pagado no puede ser vacío o cero (0)';
      return;
    }
    const cambio = valorPagado - this.ventaSel.valorFactura;
    if (cambio >= 0) {
      this.pagoSel.valorPagado = valorPagado;
      this.pagoSel.valorFacturado = this.ventaSel.valorFactura;
      this.pagoSel.valorCambio = cambio;
      this.errorPago = undefined;
      this.closeModal('ventas-factura:pagarMd');
    } else {
      this.errorPago = 'El valor pagado es inferior al valor de la venta';
    }
    return;
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

}
