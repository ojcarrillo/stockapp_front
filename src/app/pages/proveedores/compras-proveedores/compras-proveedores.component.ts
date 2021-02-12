import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../../models/proveedor.model';
import { MatTableDataSource } from '@angular/material/table';
import { Articulo } from 'src/app/models/articulo.model';
import { Fatura } from '../../../models/factura.model';
import { DetalleFacturProveedor } from '../../../models/detalle-factura-proveedor.model';
import { ProveedorService } from '../../../mantenimiento/services/proveedor.service';
import { ArticulosService } from '../../../mantenimiento/services/articulos.service';

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
  articulo: DetalleFacturProveedor;

  selectRowIndex = -1;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<DetalleFacturProveedor>();

  /* nombres de columnas y sus etiquetas */
  colsArticulos = [{
    id: 'id',
    value: 'No.',
  }, {
    id: 'articulo',
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
  }
  ];


  constructor(
    private proveedorService: ProveedorService,
    private articuloService: ArticulosService) { }

  ngOnInit(): void {
    this.displayedColumns = this.colsArticulos.map(x => x.id);
    this.dataSource.data = [];
  }

  seleccion(obj: any) {

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
          this.articuloSel = resp._embedded.articulos[0];
        }
      },
        error => { });
  }
}
