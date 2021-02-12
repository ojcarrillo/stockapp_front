import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { VerProveedoresComponent } from './proveedores/ver-proveedores/ver-proveedores.component';
import { VerExistenciasComponent } from './inventario/ver-existencias/ver-existencias.component';
import { ComprasProveedoresComponent } from './proveedores/compras-proveedores/compras-proveedores.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'ver-existencias', component: VerExistenciasComponent, data: { parent: 'Inventario', titulo: 'Ver Existencias' } },
            { path: 'ver-proveedores', component: VerProveedoresComponent, data: { parent: 'Proveedores', titulo: 'Ver Proveedores' } },
            { path: 'compras-proveedores', component: ComprasProveedoresComponent, data: { parent: 'Proveedores', titulo: 'Compras a Proveedores' } }
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


