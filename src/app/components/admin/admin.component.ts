import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { takeWhile, first } from "rxjs/operators";
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { CatalogoService } from 'src/app/services/catalogo.service';
import { async } from 'rxjs/internal/scheduler/async';
import { error } from 'protractor';
import { catalogoModel } from '../../models/catalogo.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy, OnChanges {
  //
  catalogoForm: FormGroup;
  adminForm: FormGroup;
  loading = false;
  submitted = false;
  //
  public isAuth: boolean = false;
  public alive: boolean = true;
  public user: any;
  public Articulos: any
  //
  constructor(public auth: AuthService,
    public catalogoService: CatalogoService,
    private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
    this.user = this.auth.user();
    this.getCatalogoDesc();
  }

  ngOnInit() {
    this.adminForm = this.formBuilder.group({
      id: [null],
      grupo: ['', [Validators.required]],
      claveart: ['', [Validators.required]],
      articulo: ['', [Validators.required]],
      urlimagen: ['', [Validators.required]],
      impuesto: [0, [Validators.required]],
      precio: [0, [Validators.required]]
    });

    this.catalogoForm = this.formBuilder.group({
      id: [null],
      grupo: [''],
      claveart: [''],
      articulo: ['']
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngOnChanges() {
    this.user = this.auth.user();
    this.getCatalogoDesc();
  }
  // convenience getter for easy access to form fields
  get f() { return this.adminForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    //
    // stop here if form is invalid
    if (this.adminForm.invalid) {
      return;
    }
    //saveArticulo
    this.catalogoService.saveArticulo(this.adminForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.success('Hello, Articulo saved successfully', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          this.getCatalogoDesc();
          this.onReset();
        },
        error => {
          this.toastr.error('Error register: ' + _.get(error, 'error'), 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          })
          this.onReset();
        });
  }

  onReset() {
    this.submitted = false;
    this.loading = false;
    this.catalogoService.selectCatalogo = new catalogoModel();
    this.adminForm.reset();
  }

  buscar() {
    this.submitted = true;
    this.loading = true;
    //
    // stop here if form is invalid
    if (this.catalogoForm.invalid) {
      return;
    }
    //
    this.getCatalogoArt(this.catalogoForm.value);
    //
  }

  getCatalogoArt(dataInt: any) {
    try {
      this.catalogoService.getCatalogoArt(dataInt)
        .subscribe((data: any) => {
          this.Articulos = data.data;
          this.toastr.success('Hello: Successful search.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          this.submitted = false;
          this.loading = false;
          this.onReset();
        }, error => {
          this.toastr.success('Hello: Your session has expired, just log in again.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          this.auth.logout();
          this.router.navigate(['home']);
        });
    } catch (e) {
      console.log('error: ', e);
      this.auth.logout();
      this.router.navigate(['home']);
    }
  }

  editCatalogo(art: any) {
    this.catalogoService.selectCatalogo = Object.assign({}, art);
  }

  deleteCatalogo(vh: any) {
    // pendiente
    this.catalogoService.selectCatalogo = Object.assign({}, vh);
  }

  getCatalogoDesc() {
    try {
      this.catalogoService.getCatalogoDesc()
        .subscribe((data: any) => {
          this.Articulos = data.data;
          this.toastr.success('Hello: Successful search.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          this.submitted = false;
          this.loading = false;
          this.onReset();
        }, error => {
          this.toastr.success('Hello: Your session has expired, just log in again.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          this.auth.logout();
          this.router.navigate(['home']);
        });
    } catch (e) {
      console.log('error: ', e);
      this.auth.logout();
      this.router.navigate(['home']);
    }
  }
}
