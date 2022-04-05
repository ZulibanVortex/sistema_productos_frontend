import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { citiesTable, cityTable } from 'src/app/models/ciudad.model';
import { CityService } from 'src/app/services/city.service';
import { ProductoService } from 'src/app/services/producto.service';
import { productSave } from '../../models/producto.model';
import {toastme} from 'toastmejs'
import { citySave } from '../../models/ciudad.model';
import Swal from 'sweetalert2';
import { URL_SERVICIOS } from 'src/app/config/config';



@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  firstFormGroup: FormGroup;
  imgURL: any;
  message: String;
  fileToUpload: File = null;
  productId: number;
  productData: productSave = {
    nombre: null,
    precio: null,
    cantidad: null,
    observaciones: null
  }
  toppings = new FormControl();
  citiesList: citiesTable[];
  cities: cityTable[] = [];
  preseleccionados = [];
  urlImages = URL_SERVICIOS;
  formData = new FormData();
  MAXIMO_TAMANIO_BYTES = 10000000;
  selectedImage = true;
  loadedCities = false;
  loadedProduct = false;
  loadedCitiesProduct = false;
  constructor(private productoService: ProductoService, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public router: Router, private cityService: CityService) { 
    activatedRoute.params.subscribe(params => {
      this.productId = params['productId'];
    });
  }

  async ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
    });
    if (this.productId) {
      await this.loadCities();
      await this.loadProductData(this.productId);
      await this.getCitiesProduct(this.productId);
    }
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
  
  validateForm(): boolean {
    const valid = (this.productData.nombre && this.productData.precio && this.productData.cantidad && this.productData.observaciones && this.selectedImage) ? true: false;
    return valid;
  }
  async loadCities() {
    this.cityService.loadCities().toPromise()
      .then((resp: any) => {
        this.citiesList = resp.ciudades;
        this.loadedCities = true;
      });
  }
  async loadProductData(id: number) {
    this.productoService.getProduct(id).toPromise()
      .then((resp: any) => {
        this.productData = resp.producto;
        this.loadedProduct = true; 
      },
      error => {
        this.router.navigate(['/dashboard']);
      });
  }
  async getCitiesProduct(productId: number) {
    this.productoService.getCitiesProduct(productId).toPromise()
      .then((resp: any) => {
        this.cities = resp.ciudades;
        for (let i = 0; i < this.cities.length; i++) {
          this.preseleccionados.push(this.cities[i].id_city);
        }
        this.loadedCitiesProduct = true;
      });
  }

  onUpdate() {
    if (this.toppings.value.length > 0) {
      this.productoService.updateProduct(this.productId,this.productData).toPromise()
      .then((resp: any) => {
        if (this.imgURL) {
          if (this.fileToUpload.size <= this.MAXIMO_TAMANIO_BYTES) {
            this.uploadImage(this.productId);
          } else {
            toastme.error('La imegen a cargar debe tener un tamaño menor a 10MB.');
          }
        }
        const igual = this.compareItems(this.toppings.value, this.preseleccionados);
        if(igual == 0) {
          this.cityService.deleteCitiesProduct(this.productId).toPromise()
            .then((resp: any) => {
              for (let i = 0; i < this.toppings.value.length; i++) {
                const city: citySave = {
                  id_product: this.productId,
                  id_city: this.toppings.value[i]
                }
                this.cityService.saveCity(city).toPromise()
                  .then((resp: any) => {
                    if(i == this.toppings.value.length - 1) {
                      Swal.fire({
                        title: 'Producto Actualizado',
                        text: this.productData.nombre,
                        icon: 'success'
                      });
                      this.router.navigate(['/dashboard']);
                    }
                  });
              }
            });
        } else {
          Swal.fire({
            title: 'Producto Actualizado',
            text: this.productData.nombre,
            icon: 'success'
          });
          this.router.navigate(['/dashboard']);
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

  compareItems(array1: any, array2: any) {
    if (array1.length == array2.length) {
      for (let i = 0; i < array1.length; i++) {
        const valor1 = array1[i];
        const valor2 = array2[i];
        if (valor1 == valor2) {
        } else {
          return 0;
        }
      }
    } else {
      return 0;
    }
  }

  uploadImage(id: number) {
    this.formData.append('file', this.fileToUpload);
    this.productoService.uploadImage(id, this.formData).toPromise()
      .then((resp: any) => {
        console.log(resp);
      });
  }

}
