import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empty } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { URL_SERVICIOS } from '../config/config';
import { productSave } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(public http: HttpClient) { }

  loadProducts() {
    const url = URL_SERVICIOS + 'productos/list';
    return this.http.get(url)
  }

  getProduct(productId: number) {
    const url = URL_SERVICIOS + 'productos/view/' + productId;
    return this.http.get(url);
  }

  getCitiesProduct(productId: number) {
    const url = URL_SERVICIOS + 'cities/list/' + productId;
    return this.http.get(url);
  }

  deleteProduct(productId: number) {
    const url = URL_SERVICIOS + 'productos/delete/' + productId;
    return this.http.delete(url);
  }

  createProduct(product: productSave) {
    const url = URL_SERVICIOS + 'productos/register';
    return this.http.post(url, product);
  }

  updateProduct(idProduct: number, product: productSave) {
    const url = URL_SERVICIOS + 'productos/update/' + idProduct;
    return this.http.put(url, product);
  }
}
