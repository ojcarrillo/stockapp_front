import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { RouterModule } from '@angular/router';
import { DigitOnlyDirective } from './digit-only.directive';
import { ModalModule } from './_modal/modal.module';
import { ListadoArticulosComponent } from '../components/listado-articulos/listado-articulos.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    HeaderComponent,
    SidebarComponent,
    NopagefoundComponent,
    DigitOnlyDirective
  ],
  exports: [
    BreadcrumbsComponent,
    HeaderComponent,
    SidebarComponent,
    NopagefoundComponent,
    DigitOnlyDirective,
    ModalModule
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule,
    ComponentsModule
  ]
})
export class SharedModule { }
