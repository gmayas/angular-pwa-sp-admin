import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment'
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import 'rxjs-compat/add/operator/takeUntil';
import * as _ from "lodash";
import { ToastrService } from 'ngx-toastr';
import { catalogoModel } from '../models/catalogo.model'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  public selectCatalogo: catalogoModel;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService,
    private auth: AuthService) {
    this.selectCatalogo = new catalogoModel;
  }

  getCatalogo(id: number) {
    try {
      let urlInt: any;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'token': localStorage.getItem('jwtToken')
        })
      };
      //console.log('httpOptions: ', httpOptions)
      if (_.isNil(id)) {
        urlInt = environment.api_url + `/spproject/getCatalogo`;
      } else {
        urlInt = environment.api_url + `/spproject/getCatalogo/${id}`;
      }
      return this.http.get(urlInt, httpOptions)
        .pipe(map((data: any) => {
          //console.log('data: ', data)
          return data;
        }, error => {
          this.auth.logout();
          this.router.navigate(['home']);
          this.toastr.success('Hello: Your session has expired, just log in again.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          //console.log('error profile: ', error)
        }));
    } catch (e) {
      console.log('error profile: ', e)
    }
  }

  getCatalogoDesc() {
    try {
      let urlInt: any = environment.api_url + `/spproject/getCatalogoDesc`;;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'token': localStorage.getItem('jwtToken')
        })
      };
      //console.log('urlInt: ', urlInt)
      //console.log('httpOptions: ', httpOptions)
      return this.http.get(urlInt, httpOptions)
        .pipe(map((data: any) => {
          //console.log('data: ', data)
          return data;
        }, error => {
          this.auth.logout();
          this.router.navigate(['home']);
          this.toastr.success('Hello: Your session has expired, just log in again.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          //console.log('error profile: ', error)
        }));
    } catch (e) {
      console.log('error profile: ', e)
    }
  }

  saveArticulo(dataIn: any) {
    try {
      console.log('dataIn: ', dataIn);
      let api_url: any, params: any = {}, headers;
      params.id = _.get(dataIn, 'id');
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': localStorage.getItem('jwtToken')
      });
      //
      let dataArticulo: any = {
        id: _.get(dataIn, 'id'),
        grupo: _.get(dataIn, 'grupo'),
        claveart: _.get(dataIn, 'claveart'),
        articulo: _.get(dataIn, 'articulo'),
        urlimagen: _.get(dataIn, 'urlimagen'),
        impuesto: _.get(dataIn, 'impuesto'),
        precio: _.get(dataIn, 'precio'),
      };
      //
      if (_.isNil(dataArticulo.id) || dataArticulo.id == 0) {
        api_url = environment.api_url + '/spproject/addArticulo';
      } else {
        api_url = environment.api_url + `/spproject/updateArticulo/${params.id}`
      };
      //console.log('environment.api_url: ', api_url)
      //console.log('dataArticulo: ', dataArticulo);
      //console.log('headers: ', headers);
      return this.http.post(api_url, dataArticulo, { headers })
        .pipe(map((data: any) => {
          //console.log('data: ', data)
          return data;
        }, error => {
          this.auth.logout();
          this.router.navigate(['home']);
          this.toastr.success('Hello: Your session has expired, just log in again.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          //console.log('error profile: ', error)
        }));
    } catch (e) {
      console.log('error profile: ', e)
    }
  }
}
