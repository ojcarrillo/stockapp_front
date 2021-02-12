import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TipoArticuloComponent } from './tipo-articulo/tipo-articulo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MantenimientoComponent } from './mantenimiento.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { IvaComponent } from './iva/iva.component';
import { UnidadComponent } from './unidad/unidad.component';
import { PresentacionComponent } from './presentacion/presentacion.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DatosGeneralesProgramaComponent } from './datos-generales-programa/datos-generales-programa.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

import { PaginatorDirective } from '../shared/style-paginator.directive';
import { getMyPaginatorIntl } from '../shared/conf-paginator.intl';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { ComponentsModule } from '../components/components.module';


@NgModule({
  declarations: [
    TipoArticuloComponent,
    MantenimientoComponent,
    IvaComponent,
    UnidadComponent,
    PresentacionComponent,
    ArticuloComponent,
    ProveedorComponent,
    UsuarioComponent,
    DatosGeneralesProgramaComponent,
    PaginatorDirective
  ],
  exports: [
    TipoArticuloComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    ComponentsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getMyPaginatorIntl() },
    CurrencyPipe
  ]
})
export class MantinimientoModule { }
