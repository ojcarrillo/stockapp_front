import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleVentaFactura } from '../../../models/detalle-venta-factura.model';
import { getValueObject, formatDate } from '../../../shared/app-settings.module';
import { FacturaService } from '../../../mantenimiento/services/factura.service';
import { VentaFacturaService } from '../../../mantenimiento/services/venta-factura.service';
import { Venta } from '../../../models/venta-factura.model';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.css']
})
export class DevolucionesComponent implements OnInit {

  numeroFactura;

  ventaSel = new Venta();

  selectRowIndex = -1;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<DetalleVentaFactura>();

  /* nombres de columnas y sus etiquetas */
  colsArticulos = [{
    id: '_embedded.articulo.nombreComercial',
    value: 'Artículo',
  }, {
    id: '_embedded.articulo.nombreGenerico',
    value: 'Genérico',
  }, {
    id: '_embedded.articulo.presentacion.nombre',
    value: 'Presentación',
  }, {
    id: 'cantidad',
    value: 'Cantidad',
  }, {
    id: 'valorUnitario',
    value: 'Valor Unidad',
  }, {
    id: 'valorArticulo',
    value: 'Valor Artículo',
  }
  ];


  constructor(
    private ventaFacturaService: VentaFacturaService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = ['rowNumber'].concat(this.colsArticulos.map(x => x.id));
    this.dataSource.data = [];
  }

  buscarFacturaVenta() {
    if (this.numeroFactura !== undefined && this.numeroFactura !== '') {
      this.ventaFacturaService.findByNumeroFactura(this.numeroFactura)
        .subscribe((resp: any) => {
          console.log(resp);
          this.ventaSel = resp;
          this.dataSource.data = this.ventaSel.articulos;
        },
          error => {
            console.log(error);
          });
    }
  }

  formato(valor: any) {
    return formatDate(valor, 'dd/MM/yyyy hh:mm:ss a');
  }

  obtenerValor(obj: any, id: string) {
    return getValueObject(obj, id);
  }

  reset() {
    this.ventaSel = new Venta();
    this.numeroFactura = undefined;
  }
}
