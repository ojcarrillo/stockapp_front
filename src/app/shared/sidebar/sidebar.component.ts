import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../app-settings.module';
import { Menu } from '../menu.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  rutas = AppSettings.MANTENIMIENTO_ROUTES;

  menu: Menu[];

  constructor() { }

  ngOnInit(): void {
    this.cargarMenus();
  }

  cargarMenus() {
    if (localStorage.getItem('usuarioStockApp') !== null) {
      const obj = JSON.parse(localStorage.getItem('usuarioStockApp'));
      this.menu = obj.menu;
    }
  }
}
