import { citySave } from './../../models/ciudad.model';
import { productSave } from './../../models/producto.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { Router } from '@angular/router';
import { CityService } from '../../services/city.service';
import { citiesTable } from '../../models/ciudad.model';
import Swal from 'sweetalert2';
import {toastme} from 'toastmejs'

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  firstFormGroup: FormGroup;
  imgURL: any;
  public message: String;
  public imagepath;
  productData: productSave = {
    nombre: null,
    precio: null,
    cantidad: null,
    observaciones: null
  }
  toppings = new FormControl();
  citiesList: citiesTable[];
  constructor(private formBuilder: FormBuilder, private productoService: ProductoService, public router: Router, private cityService: CityService) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
    });
    this.loadCities();
  }

  validateForm(): boolean {
    const valid = (this.productData.nombre && this.productData.precio && this.productData.cantidad && this.productData.observaciones) ? true: false;
    return valid;
  }

  loadCities() {
    this.cityService.loadCities().toPromise()
      .then((resp: any) => {
        this.citiesList = resp.ciudades;
      });
  }

  uploadFile(event) {
    const imageValidate = event.target.files[0];
    if(imageValidate) {
      const mimeType = imageValidate.type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = 'Sólo se admiten imágenes.';
        return;
      }
      const reader = new FileReader();
      this.imagepath = imageValidate;
      reader.readAsDataURL(imageValidate);
      reader.onload = (event) => {
        this.imgURL = reader.result;
      }
    }
  }

  onCreate() {
    if(this.toppings.value.length > 0) {
      this.productoService.createProduct(this.productData).toPromise()
      .then((resp: any) => {
        const idProducto = resp.idProducto;
        for (let i = 0; i < this.toppings.value.length; i++) {
          const city: citySave = {
            id_product: idProducto,
            id_city: this.toppings.value[i]
          }
          this.cityService.saveCity(city).toPromise()
            .then((resp: any) => {
              if(i == this.toppings.value.length - 1) {
                Swal.fire({
                  title: 'Producto Registrado',
                  text: this.productData.nombre,
                  icon: 'success'
                });
                this.router.navigate(['/dashboard']);
              }
            });
        }
      })
    } else {
      toastme.error('Debe seleccionar por lo menos <br> una ciudad para el producto');
    }
  }

  nameCity(id: number) {
    if(this.citiesList) {
      return this.citiesList.filter( elem => { return elem.id == id})[0] ? this.citiesList.filter( elem => { return elem.id == id})[0].nombre : '';

    }
  }

}
