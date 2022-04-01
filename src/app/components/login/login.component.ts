import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {toastme} from 'toastmejs';

import { UserI } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  register = false;
  confirmPassword = '';
  validPassword = true;
  private user: UserI = {
    email: null,
    password: null
  };
  signUpForm: FormGroup;

  constructor(private builder: FormBuilder, private userService: UsuarioService, private router: Router) { }

  ngOnInit() {
    this.signUpForm = this.builder.group({
      email : ['', [Validators.required, Validators.email]],
      password : ['', Validators.required]
    });
  }

  registerOrLogin(option) {
    option == 1 ? (this.register = true, this.signUpForm.reset()): (this.register = false, this.signUpForm.reset());
  }

  validatePassword(): boolean {
    if(this.confirmPassword != '') {
      if (this.signUpForm.value.password != this.confirmPassword) {
        toastme.error('Las contraseñas ingresadas <br> No coinciden');
        this.validPassword = false;
        return false;
      } else {
        this.validPassword = true;
        return true;
      }
    }
  }

  onLogin(infoUser: any) {
    this.user.email = infoUser.email;
    this.user.password = infoUser.password;
    return this.userService.login(this.user)
      .subscribe((resp: any) => {
        this.router.navigate(['/dashboard']);
      })
  }

  onCreate(user: any) {
    if (this.validPassword) {
      this.user.email = user.email;
      this.user.password = user.password;
      return this.userService.crearUsuario(this.user).toPromise()
        .then((resp: any) => {
          this.onLogin(this.user);
        });
    }
  }
}
