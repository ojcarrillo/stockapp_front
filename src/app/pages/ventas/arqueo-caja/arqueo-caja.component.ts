import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Venta } from '../../../models/venta-factura.model';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { formatDate } from '../../../shared/app-settings.module';
import { VentaFacturaService } from '../../../mantenimiento/services/venta-factura.service';

@Component({
  selector: 'app-arqueo-caja',
  templateUrl: './arqueo-caja.component.html',
  styleUrls: ['./arqueo-caja.component.css']
})
export class ArqueoCajaComponent implements OnInit {

  ahora;
  fechaInicio;
  horaInicio;
  fechaFin;
  horaFin;

  totales = { totalFacturas: 0, totalIva: 0, totalBase: 0, totalExento: 0, cantFacturas: 0 };

  /* paginacion proveedores */
  displayedColumns: string[];
  dataSource = new MatTableDataSource<Venta>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  pageSize = '5';

  request = { page: '0', size: this.pageSize, fechaInicio: '', fechaFin: '' };
  totalElements = 0;
  loading = false;
  pageIndex = 0;
  selectRowIndex = -1;

  /* nombres de columnas y sus etiquetas */
  columnNames = [
    {
      id: 'numeroFactura',
      value: 'Número',
      isObject: false
    }, {
      id: 'fechaVenta',
      value: 'Fecha de Expedición',
      isDate: true
    }, {
      id: 'baseFactura',
      value: 'Valor Base',
      isCurrency: true
    }, {
      id: 'valorIva',
      value: 'Valor Iva',
      isCurrency: true
    }, {
      id: 'exentoFactura',
      value: 'Valor Exento',
      isCurrency: true
    }, {
      id: 'valorFactura',
      value: 'Valor Total',
      isCurrency: true
    }
  ];

  constructor(
    private ventaService: VentaFacturaService
  ) { }

  ngOnInit(): void {
    this.initFechas();
    this.initDataSource();
  }

  private initFechas() {
    this.fechaInicio = new Date().toISOString().slice(0, 10);
    this.horaInicio = new Date().toISOString().slice(11, 19);
    this.fechaFin = new Date().toISOString().slice(0, 10);
    this.horaFin = new Date().toISOString().slice(11, 19);
    this.ahora = new Date().toISOString().slice(0, 10);
  }

  private initDataSource() {
    this.request = { page: '0', size: this.pageSize.toString(), fechaInicio: this.fechaInicio, fechaFin: this.fechaFin };
    this.displayedColumns = ['rowNumber'].concat(this.columnNames.map(x => x.id));
    this.dataSource.paginator = this.paginator;
  }

  iniciarArqueo() {
    this.request.fechaInicio = formatDate(this.fechaInicio + ' ' + this.horaInicio, 'yyyy-MM-dd HH:mm:ss');
    this.request.fechaFin = formatDate(this.fechaFin + ' ' + this.horaFin, 'yyyy-MM-dd HH:mm:ss');
    this.listarFacturas(this.request);
    this.obtenerTotales(this.request);
  }

  private obtenerTotales(params: any) {
    this.ventaService.totalizarFacturas(params)
      .subscribe((resp: any) => {
        this.totales = resp;
      }, (error: any) => {
        console.log(error);
      });
  }

  private listarFacturas(params: any) {
    this.ventaService.listarFacturas(params)
      .subscribe(
        (resp: any) => {
          this.totalElements = resp.page.totalElements;
          this.dataSource.data = resp._embedded.ventafactura;
          this.dataSource._updateChangeSubscription();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  nextPage(event: PageEvent) {
    this.request.page = event.pageIndex.toString();
    this.request.size = event.pageSize.toString();
    this.listarFacturas(this.request);
  }
}
