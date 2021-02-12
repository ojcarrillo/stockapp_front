import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private service: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
