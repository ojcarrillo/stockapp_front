import { Component, OnInit } from '@angular/core';

declare function customInitFunctions();

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styles: [
  ]
})
export class MantenimientoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    customInitFunctions();
  }

}
