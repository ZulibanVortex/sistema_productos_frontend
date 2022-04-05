import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { APP_ROUTES } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NabvarComponent } from './shared/navbar/nabvar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { ViewProductComponent } from './components/view-product/view-product.component';

import { AgmCoreModule } from '@agm/core';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { MatSelectModule } from '@angular/material/select';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { NoPageFoundComponent } from './shared/no-page-found/no-page-found.component';
import { LoadingViewComponent } from './components/loading-view/loading-view.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NabvarComponent,
    DashboardComponent,
    ViewProductComponent,
    CreateProductComponent,
    EditProductComponent,
    NoPageFoundComponent,
    LoadingViewComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCjw5zc205L6dhN-krB0ZqZvInLQWHOCbY'
    }),
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }