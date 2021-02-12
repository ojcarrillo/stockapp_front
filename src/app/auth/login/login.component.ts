import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    login: ['1234567891', [Validators.required, Validators.minLength(6)]],
    password: ['abcd123456', [Validators.required, Validators.minLength(10)]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: AuthService
  ) { }

  ngOnInit(): void {
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.service.login(this.loginForm.getRawValue())
      .subscribe(
        (resp: any) => {
          this.router.navigateByUrl('/');
        },
        error => {
          Swal.fire({
            title: '',
            text: 'No existe el usuario con el login y contraseña ingresada',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            showClass: {
              popup: ''
            },
            hideClass: {
              popup: ''
            }
          });
        }
      );
  }
}
