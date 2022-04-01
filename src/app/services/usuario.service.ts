import { Injectable } from '@angular/core';
import { UserI } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { empty } from 'rxjs';
import { URL_SERVICIOS } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  user: UserI;
  token: string;
  constructor(public http: HttpClient, public router: Router) { 
    this.loadStorage();
  }
  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }
  //Cargar info de local storage login
  loadStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
    } else {
      this.token = '';
      this.user = null;
    }
  }
  //Guardar info local storage logueado
  saveStorage(token: string, user: UserI) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.token = token;
  }
  //Cerra sesión
  logout() {
    this.user = null;
    this.token = '';
    //Removemos los datos del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  //Loguear usuario
  login(user: UserI) {
    const url = URL_SERVICIOS + 'usuarios/auth';
    return this.http.post(url, user)
      .pipe(map((resp: any) => {
        this.saveStorage(resp.token, resp.usuario);
        return true;
      }), catchError((err: any) => {
        this.router.navigate(['/login']);
        Swal.fire({
          title: 'Error en el login',
          text: 'Correo o contraseña inválidos',
          icon: 'error'
        });
        return empty();
      }));


  }
  //Registrar usuario
  crearUsuario(user: UserI) {

    const url = URL_SERVICIOS + 'usuarios/register';
    return this.http.post(url, user)
      .pipe(map((resp: any) => {
        Swal.fire({
          title: 'Usuario creado',
          text: user.email,
          icon: 'success'
        });
        return resp.usuario;
      }), catchError((err: any) => {
        Swal.fire({
          title: 'Error en el registro',
          text: 'El correo ya existe!!! ',
          icon: 'error'
        });
        return empty();
      }));

  }
}
