import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from '../../../models/proveedor.model';
import { Router } from '@angular/router';
import { ProveedorService } from '../../../mantenimiento/services/proveedor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ver-proveedores',
  templateUrl: './ver-proveedores.component.html',
  styleUrls: ['./ver-proveedores.component.css']
})
export class VerProveedoresComponent implements OnInit {

  proveedorSel: Proveedor;

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.proveedorSel = new Proveedor('', '', '', '');
  }

  seleccionarProveedor(obj: Proveedor) {
    this.proveedorSel = obj;
  }
}
