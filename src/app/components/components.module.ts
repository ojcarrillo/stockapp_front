import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListadoProveedoresComponent } from './listado-proveedores/listado-proveedores.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ListadoArticulosComponent } from './listado-articulos/listado-articulos.component';



@NgModule({
  declarations: [
    ListadoProveedoresComponent,
    ListadoArticulosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    FormsModule
  ],
  exports: [
    ListadoProveedoresComponent,
    ListadoArticulosComponent,
  ]
})
export class ComponentsModule { }
