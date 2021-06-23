import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { ModalService } from '../_modal/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {


  idModalArticulos = 'header:verArticulosMD';

  constructor(
    private router: Router,
    private service: AuthService,
    private modalService: ModalService) { }

  ngOnInit(): void {
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }

  @HostListener('document:keydown.f3')
  abrirModalPago() {
    this.openModal(this.idModalArticulos);
    return false;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
