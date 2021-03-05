import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { VerProveedoresComponent } from './proveedores/ver-proveedores/ver-proveedores.component';
import { VerExistenciasComponent } from './inventario/ver-existencias/ver-existencias.component';
import { ComprasProveedoresComponent } from './proveedores/compras-proveedores/compras-proveedores.component';
import { VentaFacturaComponent } from './ventas/venta-factura/venta-factura.component';
import { CapturaFotosComponent } from './otros/captura-fotos/captura-fotos.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'ver-existencias', component: VerExistenciasComponent, data: { parent: 'Inventario', titulo: 'Ver Existencias' } },
            { path: 'ver-proveedores', component: VerProveedoresComponent, data: { parent: 'Proveedores', titulo: 'Ver Proveedores' } },
            { path: 'compras-proveedores', component: ComprasProveedoresComponent, data: { parent: 'Proveedores', titulo: 'Compras a Proveedores' } },
            { path: 'venta-factura', component: VentaFacturaComponent, data: { parent: 'Ventas', titulo: 'Ventas con Factura' } },
            { path: 'capturar-imaganes', component: CapturaFotosComponent, data: { parent: '', titulo: 'Capturar Imágenes Camara' } }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class PagesRoutingModule { }


