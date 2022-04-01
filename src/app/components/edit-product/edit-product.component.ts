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



@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  firstFormGroup: FormGroup;
  productId: number;
  productData: productSave = {
    nombre: null,
    precio: null,
    cantidad: null,
    observaciones: null
  }
  cargando = true;
  toppings = new FormControl();
  citiesList: citiesTable[];
  cities: cityTable[] = [];
  preseleccionados = [];
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
  
  validateForm(): boolean {
    const valid = (this.productData.nombre && this.productData.precio && this.productData.cantidad && this.productData.observaciones) ? true: false;
    return valid;
  }
  async loadCities() {
    this.cityService.loadCities().toPromise()
      .then((resp: any) => {
        this.citiesList = resp.ciudades;
      });
  }
  async loadProductData(id: number) {
    this.productoService.getProduct(id).toPromise()
      .then((resp: any) => {
        this.productData = resp.producto;
      });
  }
  async getCitiesProduct(productId: number) {
    this.productoService.getCitiesProduct(productId).toPromise()
      .then((resp: any) => {
        this.cities = resp.ciudades;
        for (let i = 0; i < this.cities.length; i++) {
          this.preseleccionados.push(this.cities[i].id_city);
        }
        this.cargando = false;
      });
  }

  onUpdate() {
    if (this.toppings.value.length > 0) {
      this.productoService.updateProduct(this.productId,this.productData).toPromise()
      .then((resp: any) => {
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
                        title: 'Producto Actualizad',
                        text: this.productData.nombre,
                        icon: 'success'
                      });
                      this.router.navigate(['/dashboard']);
                    }
                  });
              }
            });
        } else {
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

}
