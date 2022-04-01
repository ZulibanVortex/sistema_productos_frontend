import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { citySave } from '../models/ciudad.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(public http: HttpClient) { }

  loadCities() {
    const url = URL_SERVICIOS + 'city/list';
    return this.http.get(url);
  }

  saveCity(city: citySave) {
    const url = URL_SERVICIOS + 'cities/register';
    return this.http.post(url, city);
  }

  deleteCitiesProduct(productId) {
    const url = URL_SERVICIOS + 'cities/delete/' + productId;
    return this.http.delete(url);
  }
}
