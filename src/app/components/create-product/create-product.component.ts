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
  message: String;
  fileToUpload: File = null;
  productData: productSave = {
    nombre: null,
    precio: null,
    cantidad: null,
    observaciones: null
  }
  toppings = new FormControl();
  citiesList: citiesTable[];
  formData = new FormData();
  MAXIMO_TAMANIO_BYTES = 10000000;
  selectedImage = false;
  loadedCities = false;
  constructor(private formBuilder: FormBuilder, private productoService: ProductoService, public router: Router, private cityService: CityService) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
    });
    this.loadCities();
  }

  validateForm(): boolean {
    const valid = (this.productData.nombre && this.productData.precio && this.productData.cantidad && this.productData.observaciones && this.selectedImage) ? true: false;
    return valid;
  }

  loadCities() {
    this.cityService.loadCities().toPromise()
      .then((resp: any) => {
        this.citiesList = resp.ciudades;
        this.loadedCities = true;
      });
  }

  uploadFile(event) {
    this.fileToUpload = event.target.files[0];
    if(this.fileToUpload) {
      this.selectedImage = true;
      const mimeType = this.fileToUpload.type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = 'Sólo se admiten imágenes.';
        this.selectedImage = false;
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(this.fileToUpload);
      reader.onload = (event) => {
        this.imgURL = reader.result;
      }
    } else {
      this.selectedImage = false;
    }
  }

  onCreate() {
    if (this.fileToUpload.size <= this.MAXIMO_TAMANIO_BYTES) {
      if(this.toppings.value.length > 0) {
        this.productoService.createProduct(this.productData).toPromise()
        .then((resp: any) => {
          const idProducto = resp.idProducto;
          this.uploadImage(idProducto);
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
    } else {
      toastme.error('La imegen a cargar debe tener un tamaño menor a 10MB.');
    }
  }

  nameCity(id: number) {
    if(this.citiesList) {
      return this.citiesList.filter( elem => { return elem.id == id})[0] ? this.citiesList.filter( elem => { return elem.id == id})[0].nombre : '';
    }
  }

  uploadImage(id: number) {
    this.formData.append('file', this.fileToUpload);
    this.productoService.uploadImage(id, this.formData).toPromise()
      .then((resp: any) => {
      });
  }
}
