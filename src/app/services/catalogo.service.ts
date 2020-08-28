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
      //
      if (_.isNil(id)) {
        urlInt = environment.api_url + `/spproject/getCatalogo`;
      } else {
        urlInt = environment.api_url + `/spproject/getCatalogo/${id}`;
      }
      return this.http.get(urlInt, httpOptions)
        .pipe(map((data: any) => {
          return data;
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
      return this.http.get(urlInt, httpOptions)
        .pipe(map((data: any) => {
          return data;
        }));
    } catch (e) {
      console.log('error profile: ', e)
    }
  }

  saveArticulo(dataIn: any) {
    try {
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
      //
      return this.http.post(api_url, dataArticulo, { headers })
        .pipe(map((data: any) => {
          return data;
        }, error => {
          this.auth.logout();
          this.router.navigate(['home']);
          this.toastr.success('Hello: Your session has expired, just log in again.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
        }));
    } catch (e) {
      console.log('error profile: ', e)
    }
  }


  getCatalogoArt(dataIn: any) {
    try {
      let params: any = {
        grupo: _.get(dataIn, 'grupo',''),
        claveart: _.get(dataIn, 'claveart',''),
        articulo: _.get(dataIn, 'articulo','')
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': localStorage.getItem('jwtToken')
      });
      //
      let api_url: any = environment.api_url + `/spproject/getCatalogoArt`;
      return this.http.get(api_url, { params, headers })
        .pipe(map((data: any) => {
          return data;
        }));
    } catch (e) {
      console.log('error getBookings: ', e)
    }
  }
}
