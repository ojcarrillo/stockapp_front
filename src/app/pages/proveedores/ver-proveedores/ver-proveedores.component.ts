import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from '../../../models/proveedor.model';
import { Router } from '@angular/router';
import { ProveedorService } from '../../../mantenimiento/services/proveedor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FacturaService } from '../../../mantenimiento/services/factura.service';
import { Factura } from '../../../models/factura.model';
import { ModalService } from '../../../shared/_modal/modal.service';
import { PagoFacturaProveedor } from '../../../models/pago-factura-proveedor.model';
import { PagoFacturaProveedorService } from '../../../mantenimiento/services/pago-factura-proveedor.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings, setFocus } from '../../../shared/app-settings.module';
import { VerFacturaComponent } from '../ver-factura/ver-factura.component';

@Component({
  selector: 'app-ver-proveedores',
  templateUrl: './ver-proveedores.component.html',
  styleUrls: ['./ver-proveedores.component.css']
})
export class VerProveedoresComponent implements OnInit {

  ahora;
  totalesPagosFacturasProveedor = {
    totalPagadas: 0, cantidadPagadas: 0,
    totalPendientes: 0, cantidadPendientes: 0
  };
  totalAbonos;

  proveedorSel: Proveedor;
  facturaSel: Factura;
  pagoFacturaSel: PagoFacturaProveedor;
  pagosAFactura: PagoFacturaProveedor[];

  @ViewChild(VerFacturaComponent, { static: false }) verFacturaComponent: VerFacturaComponent;

  /* paginacion proveedores */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Factura>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  pageSize = '5';
  request = { page: '0', size: this.pageSize, filtro: '' };
  totalElements = 0;
  loading = false;
  pageIndex = 0;
  selectRowIndex = -1;

  /* nombres de columnas y sus etiquetas */
  columnNames = [
    /*{
    id: 'id',
    value: 'No.',
    isObject: false
  },*/ {
      id: 'numeroFactura',
      value: 'Número',
      isObject: false
    }, {
      id: 'fechaExpedicion',
      value: 'Fecha de Expedición',
      isDate: true
    }, {
      id: 'valorIva',
      value: 'Valor Iva',
      isCurrency: true
    }, {
      id: 'valorFactura',
      value: 'Valor Total',
      isCurrency: true
    }, {
      id: 'fechaVencimiento',
      value: 'Fecha de Vencimiento',
      isDate: true
    }, {
      id: 'estado',
      value: 'Pago',
      isObject: false
    }
  ];


  constructor(
    private router: Router,
    private modalService: ModalService,
    private facturaService: FacturaService,
    private pagoFacturaProveedorService: PagoFacturaProveedorService) {
    this.initListadoFacturas();
  }

  ngOnInit() {
    this.proveedorSel = new Proveedor('', '', '', '');
    this.ahora = new Date().toISOString().slice(0, 10);
    this.resetPago();
  }

  initListadoFacturas() {
    this.request = { page: '0', size: this.pageSize, filtro: '' };
    this.displayedColumns = ['rowNumber'].concat(this.columnNames.map(x => x.id)).concat('opciones');
    this.dataSource.paginator = this.paginator;
  }

  seleccionarProveedor(obj: Proveedor) {
    this.proveedorSel = obj;
    const requestFac = { page: '0', size: this.pageSize, idproveedor: `${obj.id}` };
    this.listarFacturasByProveedor(requestFac);
    this.pagoFacturaProveedorService.getTotalPagoFacturaProveedor(obj.id)
      .subscribe((resp: any) => {
        if (resp.length > 0) {
          this.totalesPagosFacturasProveedor =
          {
            totalPagadas: resp[0][2], cantidadPagadas: resp[0][1],
            totalPendientes: resp[1][2], cantidadPendientes: resp[1][1]
          };
        } else {
          this.totalesPagosFacturasProveedor =
          {
            totalPagadas: 0, cantidadPagadas: 0,
            totalPendientes: 0, cantidadPendientes: 0
          };
        }
      });
  }

  private listarFacturasByProveedor(requestFac: { page: string; size: string; idproveedor: string; }) {
    this.facturaService.listarFacturasByProveedor(requestFac)
      .subscribe((resp: any) => {
        this.totalElements = resp.page.totalElements;
        this.dataSource.data = resp._embedded.facturas;
        this.dataSource._updateChangeSubscription();

        console.log(resp._embedded.facturas);

      });
  }

  seleccionarFactura(obj: Factura) {
    this.selectRowIndex = obj.id;
    this.facturaSel = obj;
  }

  verAnotaciones(obj: Factura) {
    this.facturaSel = obj;
    this.modalService.open('verAnotacionesMD');
  }

  verPagosAFactura(obj: Factura) {
    this.facturaSel = obj;
    this.pagoFacturaProveedorService.getPagosAFactura(obj.id)
      .subscribe((resp: any) => {
        this.pagosAFactura = resp._embedded.pagosfacturapoveedor;
        this.modalService.open('verPagosAFacturaMD');
        this.totalAbonos = this.pagosAFactura.reduce((a, b) => +a + +b.valorPago, 0);
      });
  }

  nextPage(event: PageEvent) {
    const requestFac = { page: event.pageIndex.toString(), size: event.pageSize.toString(), idproveedor: `${this.proveedorSel.id}` };
    this.listarFacturasByProveedor(requestFac);
  }

  resetPago() {
    this.pagoFacturaSel = new PagoFacturaProveedor();
    this.pagoFacturaSel.metodoPago = 'e';
    this.pagoFacturaSel.descuento = 0;
  }

  guardarPago() {
    if (this.proveedorSel.id === undefined) {
      return;
    }
    if (this.facturaSel.id === undefined) {
      return;
    }
    if (this.pagoFacturaSel.fechaPago === undefined || this.pagoFacturaSel.fechaPago.toString() === '') {
      setFocus('fechaPago');
      return;
    }
    if (this.pagoFacturaSel.valorPago === undefined || this.pagoFacturaSel.valorPago.toString() === ''
      || this.pagoFacturaSel.valorPago === 0) {
      setFocus('valorPago');
      return;
    }
    if (this.pagoFacturaSel.metodoPago === 'c') {
      if (this.pagoFacturaSel.banco === undefined || this.pagoFacturaSel.banco === '') {
        setFocus('banco');
        return;
      }
      if (this.pagoFacturaSel.cheque === undefined || this.pagoFacturaSel.cheque === '') {
        setFocus('cheque');
        return;
      }
    }
    this.pagoFacturaSel.factura = this.facturaSel;
    this.pagoFacturaProveedorService.guardarPago(this.pagoFacturaSel)
      .subscribe((resp: any) => {
        Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
        this.resetPago();
        this.seleccionarProveedor(this.proveedorSel);
      },
        (error: any) => {
          const errorMsg = AppSettings.SWAL_WARNING as SweetAlertOptions;
          errorMsg.text = error.error.errormsg;
          Swal.fire(errorMsg);
          setFocus('valorPago');
        });
  }

  verDetalleFactura(obj: Factura) {
    this.facturaSel = obj;
    this.verFacturaComponent.buscarDetalle(obj.numeroFactura);
    this.modalService.open('verDetalleFacturaMD');
  }
}
