import { Component, NgModule, OnInit } from '@angular/core';
import { productTable } from '../../models/producto.model';
import { cityTable } from '../../models/ciudad.model';
import { ProductoService } from 'src/app/services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})

export class ViewProductComponent implements OnInit {
  lat = 4.0000000;
  lng = -72.0000000;
  /*lat2 = 3.4372200;
  lng2 = -76.5225000;*/
  zoom = 4;
  firstFormGroup: FormGroup;
  productId: number;
  productData: productTable = {
    id: null,
    nombre: null,
    precio: null,
    cantidad: null,
    observaciones: null
  }
  cities: cityTable[] = [];
  cargando = true;
  constructor(private productoService: ProductoService, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {
    activatedRoute.params.subscribe(params => {
      this.productId = params['productId'];
    });
  }

  async ngOnInit(){
    this.firstFormGroup = this.formBuilder.group({
    });
    if (this.productId) {
      await this.loadProductData(this.productId);
      await this.getCitiesProduct(this.productId);
    }
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
        this.cargando = false;
      });
  }

}
