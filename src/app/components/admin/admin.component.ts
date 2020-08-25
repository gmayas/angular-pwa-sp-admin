import { Component, OnInit , OnDestroy, OnChanges } from '@angular/core';
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
    //console.log('this.user.id: ', _.get(this.user.value, 'id'))
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
    //console.log('this.adminForm.invalid: ', this.adminForm.invalid);
    //console.log('this.adminForm.value: ', this.adminForm.value);
    // stop here if form is invalid
    if (this.adminForm.invalid) {
       return;
    }
    //console.log('this.adminForm.value: ', this.adminForm.value);
    //saveArticulo
    this.catalogoService.saveArticulo(this.adminForm.value)
      .pipe(first())
      .subscribe(
        data => {
          //console.log('data: ', data)
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
          //console.log('error Register: ', error)
          this.onReset();
        });
  }

  onReset() {
    this.submitted = false;
    this.loading = false;
    this.catalogoService.selectCatalogo = new catalogoModel();
    this.adminForm.reset();
    //console.log('this.adminForm.value: ', this.adminForm.value);
  }

  editCatalogo(art: any) {
    this.catalogoService.selectCatalogo = Object.assign({}, art);
    //console.log('Edit selectCatalogo: ', this.catalogoService.selectCatalogo)
  }

  deleteCatalogo(vh: any) {
    // pendiente
    this.catalogoService.selectCatalogo = Object.assign({}, vh);
    //console.log('Edit selectCatalogo: ', this.catalogoService.selectCatalogo);
  }

  getCatalogoDesc() {
    this.catalogoService.getCatalogoDesc()
       .subscribe((data: any) => {
        //console.log('data: ', data);
        this.Articulos = data.data;
      });
  }
}
