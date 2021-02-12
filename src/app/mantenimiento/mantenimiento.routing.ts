import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TipoArticuloComponent } from './tipo-articulo/tipo-articulo.component';
import { MantenimientoComponent } from './mantenimiento.component';
import { IvaComponent } from './iva/iva.component';
import { PresentacionComponent } from './presentacion/presentacion.component';
import { UnidadComponent } from './unidad/unidad.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { DatosGeneralesProgramaComponent } from './datos-generales-programa/datos-generales-programa.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ArticuloComponent } from './articulo/articulo.component';


const routes: Routes = [
    {
        path: 'mantenimiento',
        component: MantenimientoComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'tipo-articulo', component: TipoArticuloComponent, data: { parent: 'Mantenimiento', titulo: 'Tipo de Artículo' } },
            { path: 'iva', component: IvaComponent, data: { parent: 'Mantenimiento', titulo: 'IVA' } },
            { path: 'presentacion', component: PresentacionComponent, data: { parent: 'Mantenimiento', titulo: 'Presentación' } },
            { path: 'unidad', component: UnidadComponent, data: { parent: 'Mantenimiento', titulo: 'Unidad' } },
            { path: 'proveedor', component: ProveedorComponent, data: { parent: 'Mantenimiento', titulo: 'Proveedor' } },
            { path: 'articulo', component: ArticuloComponent, data: { parent: 'Mantenimiento', titulo: 'Artículo' } },
            { path: 'usuario', component: UsuarioComponent, data: { parent: 'Mantenimiento', titulo: 'Usuario' } },
            { path: 'datos-programa', component: DatosGeneralesProgramaComponent, data: { parent: 'Mantenimiento', titulo: 'Datos del Programa' } }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MantenimientoRoutingModule { }


