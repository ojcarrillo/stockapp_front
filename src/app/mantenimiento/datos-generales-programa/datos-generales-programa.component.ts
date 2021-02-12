import { Component, OnInit } from '@angular/core';
import { DatosPrograma } from '../../models/datos-programa.model';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DatosProgramaService } from '../services/datos-programa.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AppSettings } from '../../shared/app-settings.module';

@Component({
  selector: 'app-datos-generales-programa',
  templateUrl: './datos-generales-programa.component.html',
  styles: [
  ]
})
export class DatosGeneralesProgramaComponent implements OnInit {

  datosPrograma: DatosPrograma;

  public guardarForm = this.fb.group({
    razonSocial: ['', [Validators.required, Validators.minLength(4)]],
    nit: ['', [Validators.required, Validators.minLength(6)]],
    direccion: ['', [Validators.required, Validators.minLength(10)]],
    resolucion: ['', [Validators.required, Validators.minLength(4)]],
    fechaResolucion: ['', [Validators.required, Validators.minLength(10)]],
    prefijo: ['', [Validators.required, Validators.minLength(1)]],
    inicioNumeracion: ['', [Validators.required]],
    finNumeracion: ['', [Validators.required]],
    regimen: ['', [Validators.required]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: DatosProgramaService) { }

  ngOnInit(): void {
    this.cargarDatosPrograma();
  }

  cargarDatosPrograma() {
    this.service.consultarDatosPrograma()
      .subscribe((resp: any) => {
        this.datosPrograma = resp;
        Object.keys(this.guardarForm.controls).forEach(key => {
          this.guardarForm.get(key).setValue(resp[key]);
        });
      },
        error => {
          console.log(error);
        });
  }

  guardar() {
    if (!this.guardarForm.valid) {
      return;
    }
    console.log(this.datosPrograma);
    this.datosPrograma = this.guardarForm.getRawValue();
    console.log(this.guardarForm.getRawValue());

    this.service.actualizarDatosPrograma(this.datosPrograma)
      .subscribe((resp: any) => {
        Swal.fire(AppSettings.SWAL_GUARDADO as SweetAlertOptions);
      },
        error => {
          console.log(error);
        });
  }
}
