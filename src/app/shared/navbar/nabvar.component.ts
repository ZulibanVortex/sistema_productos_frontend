import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.css']
})
export class NabvarComponent implements OnInit {

  constructor(private userService: UsuarioService) { }

  ngOnInit(): void {
  }

  logout() {
    this.userService.logout();
  }
}
