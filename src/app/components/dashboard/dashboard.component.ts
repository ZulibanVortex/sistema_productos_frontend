import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { productTable } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['name', 'price', 'cities', 'actions'];
  productsList: productTable [] = [];
  dataSource: any;
  loadTable: boolean;
  constructor(private productoService: ProductoService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loadTable = false;
    this.productoService.loadProducts().toPromise()
      .then((resp: any) => {
        this.dataSource = new MatTableDataSource(resp.productos);
        this.loadTable = true;
      });
  }
  removeProduct(id: number) {
    Swal.fire({
      title: 'Deseas eliminar este producto?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProduct(id).toPromise()
          .then((resp: any) => {
            this.loadProducts();
          })
      }
    })
  }
}
