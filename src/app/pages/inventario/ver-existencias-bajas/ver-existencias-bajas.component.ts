import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.model';
import { Iva } from 'src/app/models/iva.model';
import { Presentacion } from 'src/app/models/presentacion.model';
import { TipoArticulo } from 'src/app/models/tipo-articulo.model';
import { Unidad } from 'src/app/models/unidad.model';

@Component({
  selector: 'app-ver-existencias-bajas',
  templateUrl: './ver-existencias-bajas.component.html',
  styles: [
  ]
})
export class VerExistenciasBajasComponent implements OnInit {

  articuloSel = new Articulo('', '', new Presentacion('', false, false), 0, 0, new Unidad('', false, false), 1,
    new Unidad('', false, false), new Iva('', 0, false, false), new TipoArticulo('', false, false), '', 0, 0, false);

  constructor() { }

  ngOnInit(): void {
  }

  seleccionarArticulo(obj: Articulo) {
    this.articuloSel = obj;
    window.scroll(0, 0);
  }

}
