import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { VerProveedoresComponent } from './proveedores/ver-proveedores/ver-proveedores.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { VerExistenciasComponent } from './inventario/ver-existencias/ver-existencias.component';
import { ComprasProveedoresComponent } from './proveedores/compras-proveedores/compras-proveedores.component';
import { ModalModule } from '../shared/_modal/modal.module';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    VerProveedoresComponent,
    VerExistenciasComponent,
    ComprasProveedoresComponent
  ],
  exports: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    FormsModule,
    ComponentsModule,
    MatInputModule,
    MatAutocompleteModule,
    ModalModule
  ]
})
export class PagesModule { }
