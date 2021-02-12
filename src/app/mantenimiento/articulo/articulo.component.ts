import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ArticulosService } from '../services/articulos.service';

import { UnidadService } from '../services/unidad.service';
import { TipoArticuloService } from '../services/tipo-articulo.service';
import { PresentacionService } from '../services/presentacion.service';
import { IvaService } from '../services/iva.service';
import { Presentacion } from '../../models/presentacion.model';
import { Iva } from '../../models/iva.model';
import { TipoArticulo } from '../../models/tipo-articulo.model';
import { Unidad } from '../../models/unidad.model';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings } from '../../shared/app-settings.module';
import { ListadoArticulosComponent } from '../../components/listado-articulos/listado-articulos.component';
import { Articulo } from 'src/app/models/articulo.model';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {

  tabIndex = 0;

  public guardarForm = this.fb.group({
    nombreGenerico: ['', [Validators.required, Validators.minLength(4)]],
    nombreComercial: ['', [Validators.required, Validators.minLength(4)]],
    valorCompra: [0, [Validators.required, Validators.min(1)]],
    valorVenta: [0, [Validators.required, Validators.min(1)]],
    unidadcompra: [null, [Validators.required]],
    conversion: [1, [Validators.required]],
    unidadventa: [null, [Validators.required]],
    tipoarticulo: [null, Validators.required],
    iva: [null, Validators.required],
    presentacion: [null, Validators.required],
    existencias: [0, [Validators.required, Validators.min(0)]],
    existenciasMinimas: [0, [Validators.required, Validators.min(0)]],
    activo: [true]
  });

  articuloEditar: Articulo;

  presentaciones: Presentacion[];
  ivas: Iva[];
  tipoArticulos: TipoArticulo[];
  unidadesCompra: Unidad[];
  unidadesVenta: Unidad[];

  @ViewChild(ListadoArticulosComponent, { static: false }) listadoComponent: ListadoArticulosComponent;

  constructor(
    private fb: FormBuilder,
    private service: ArticulosService,
    private unidadService: UnidadService,
    private tipoArticuloService: TipoArticuloService,
    private presentacionService: PresentacionService,
    private ivaService: IvaService) { }

  ngOnInit(): void {
    this.cargarSelects();
  }

  cargarSelects() {
    this.listarIvas();
    this.listarPresentacion();
    this.listarTipoArticulos();
    this.listarUnidades();
  }

  listarPresentacion() {
    this.presentacionService.listarPresentaciones({ page: '0', size: '50' })
      .subscribe((resp: any) => {
        this.presentaciones = resp._embedded.presentaciones;
      });
  }

  listarIvas() {
    this.ivaService.listarIvas({ page: '0', size: '50' })
      .subscribe((resp: any) => {
        this.ivas = resp._embedded.ivas;
      });
  }

  listarTipoArticulos() {
    this.tipoArticuloService.listarTipoArticulos({ page: '0', size: '50' })
      .subscribe((resp: any) => {
        this.tipoArticulos = resp._embedded.tipoarticulos;
      });
  }

  listarUnidades() {
    this.unidadService.listarUnidades({ page: '0', size: '50' })
      .subscribe((resp: any) => {
        this.unidadesCompra = resp._embedded.unidades;
        this.unidadesVenta = resp._embedded.unidades;
      });
  }

  guardar() {
    if (!this.guardarForm.valid) {
      return;
    }
    let articulo: Articulo;
    articulo = this.guardarForm.getRawValue();
    if (this.articuloEditar) {
      articulo.id = this.articuloEditar.id;
    }
    this.service.guardarArticulo(articulo)
      .subscribe(
        (resp: any) => {
          this.actualizarVista();
        },
        error => {
          console.log('error :: ', error);
        });
  }

  editar(articulo: Articulo) {
    Object.keys(this.guardarForm.controls).forEach(key => {
      this.guardarForm.get(key).setValue(articulo[key]);
    });
    this.articuloEditar = articulo;
    this.tabIndex = 0;
  }

  compareObjectsId(object1: any, object2: any) {
    return object1 && object2 && object1.id === object2.id;
  }

  private actualizarVista() {
    Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
    this.guardarForm.reset();
    this.articuloEditar = null;
    this.listadoComponent.actualizar();
  }
}
