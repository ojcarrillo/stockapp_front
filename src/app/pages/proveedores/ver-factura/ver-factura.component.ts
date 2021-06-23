import { Component, OnInit, Input } from '@angular/core';
import { setFocus, formatDate, getValueObject } from '../../../shared/app-settings.module';
import { Factura } from '../../../models/factura.model';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleFacturProveedor } from '../../../models/detalle-factura-proveedor.model';
import { FacturaService } from '../../../mantenimiento/services/factura.service';

@Component({
  selector: 'app-ver-factura',
  templateUrl: './ver-factura.component.html',
  styleUrls: ['./ver-factura.component.css']
})
export class VerFacturaComponent implements OnInit {

  @Input() numeroFactura;
  @Input() rndBuscador = true;

  factura = new Factura();

  selectRowIndex = -1;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<DetalleFacturProveedor>();

  /* nombres de columnas y sus etiquetas */
  colsArticulos = [{
    id: 'articulo.nombreComercial',
    value: 'Artículo',
  }, {
    id: 'articulo.nombreGenerico',
    value: 'Genérico',
  }, {
    id: 'articulo.presentacion.nombre',
    value: 'Presentación',
  }, {
    id: 'cantidad',
    value: 'Cantidad',
  }, {
    id: 'valorCompra',
    value: 'Valor Compra',
  }, {
    id: 'valorVenta',
    value: 'Valor Venta',
  }, {
    id: 'bonificacion',
    value: '¿Es bonificación?'
  }
  ];

  constructor(
    private facturaService: FacturaService
  ) { }

  ngOnInit(): void {
    if (this.numeroFactura === undefined || this.numeroFactura === '') {
      this.rndBuscador = true;
    } else {
      this.rndBuscador = false;
    }
    this.displayedColumns = ['rowNumber'].concat(this.colsArticulos.map(x => x.id));
    this.dataSource.data = [];
  }

  buscarFacturaCompra() {
    if (this.rndBuscador && (this.numeroFactura === undefined || this.numeroFactura === '')) {
      setFocus('numeroFactura');
      return;
    }
    this.buscarDetalle(this.numeroFactura);
  }

  buscarDetalle(numeroFactura: string) {
    this.facturaService.findByNumeroFactura(numeroFactura)
      .subscribe((resp: any) => {
        this.factura = resp;
        this.dataSource.data = this.factura.articulos;
        this.dataSource._updateChangeSubscription();
      }, (error: any) => {
        console.log(error);
      });
  }

  formato(valor: any) {
    return formatDate(valor, 'dd/MM/yyyy');
  }

  obtenerValor(obj: any, id: string) {
    return getValueObject(obj, id);
  }
}
