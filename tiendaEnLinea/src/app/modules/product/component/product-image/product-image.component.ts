import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalMessages } from '../../../../shared/swal-messages';
import { SharedModule } from '../../../../shared/shared-module';
import { NgxPhotoEditorService } from 'ngx-photo-editor';

// Ipmortaciones del producto
import { Product } from '../../_model/product';
import { ProductService } from '../../_service/product.service';

// Importaciones de la imagen del producto
import { ProductImage } from '../../_model/product-image';
import { ProductImageService } from '../../_service/product-image.service';

// Importaciones de la categoría
import { Category } from '../../_model/category';
import { CategoryService } from '../../_service/category.service';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any; // Declara la variable jQuery.

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [
    SharedModule, RouterLink,CommonModule
  ],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.css',
})

export class ProductImageComponent {
  gtin: string = ""; // product gtin
  product: Product = new Product();
  productImage: ProductImage = new ProductImage();
  images: ProductImage[] = []; // images
  product_id: number = 0; // product id

  loading = false; // loading request
  swal: SwalMessages = new SwalMessages(); // swal messages

  submitted = false; // form submitted
  form: FormGroup; // formulario
  categories: Category[] = []; // lista de categorias

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, // servicio product de API
    private productImageService: ProductImageService, // servicio product-image de API
    private ngxService: NgxPhotoEditorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService, // servicio category de API
  ){
    this.form = this.formBuilder.group({
      gtin: ["", [Validators.required]],
      product: ["", [Validators.required]],
      price: ["", [Validators.required]],
      stock: ["", [Validators.required]],
      category_id: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });
  }

  ngOnInit(){
    this.gtin = this.route.snapshot.paramMap.get('gtin')!;
    if(this.gtin){
      this.getProduct();
    }else{
      this.swal.errorMessage("Gtin inválido"); 
    }
  }

  getProduct(){
    this.loading = true;
    this.productService.getProduct(this.gtin).subscribe({
      next: (v) => {
        this.product = v;
        this.product_id = v.product_id;
        this.getCategories();
        this.getProductImages();
        this.loading = false;
        console.log(this.product);
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  getProductImages(){
    this.loading = true;
    this.productImageService.getProductImages(this.product.product_id).subscribe({
      next: (v) => {
        this.productImage = v;
        // this.product.image = v;
        this.images = v;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  updateProductImage(image: string){
    // creamos el objeto product image
    let productImage: ProductImage = new ProductImage();
    productImage.product_id = this.product.product_id;
    productImage.image = image;
 
    // enviamos la imagen a la API
    this.productImageService.updateProductImage(productImage).subscribe({
      next: (v) => {
        this.swal.successMessage(v.message);
        this.getProduct();
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error.message);
      }
    });
  }

  deleteProductImage(product_id: number){
    console.log(product_id);
    this.swal.confirmMessage.fire({
      title: "Favor de confirmar la eliminación",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productImageService.deleteProductImage(product_id).subscribe({
          next: (v) => {
            this.swal.successMessage(v.message);
            this.getProduct();
          },
          error: (e) => {
            console.error(e);
            this.swal.errorMessage(e.error.message);
          }
        });
      }
    });
  }

  // img
  fileChangeHandler($event: any) {
    this.ngxService.open($event, {
      // aspectRatio: 1 / 1,
      autoCropArea: 1,
      roundCropper: true,
      autoCrop: true,
    }).subscribe(data => {
      this.updateProductImage(data.base64!);
    });
  }

  updateProduct(){
    this.resetVariables();
    this.showModalForm();

    this.form.controls['gtin'].setValue(this.product.gtin);
    this.form.controls['product'].setValue(this.product.product);
    this.form.controls['price'].setValue(this.product.price);
    this.form.controls['stock'].setValue(this.product.stock);
    this.form.controls['category_id'].setValue(this.product.category_id);
    this.form.controls['description'].setValue(this.product.description);  
  }

  onSubmit() {
    // validación del formulario 
    this.submitted = true;
    if(this.form.invalid){ return;}
    this.submitted = false;

    console.log(this.form.value);

    this.productService.updateProduct(this.form.value, this.product_id).subscribe({
      next: (v) => {
        this.swal.successMessage(v.message);
        this.hideModalForm();
        this.gtin = this.form.value.gtin;
        this.getProduct();
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error.message);
      }
    });
  }

  getCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (v) => {
        this.categories = v;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    })
  }  
  

  resetVariables(){
    this.form.reset();
    this.submitted = false;
  }

  showModalForm() {
    $("#modalForm").modal("show");
  } 

  /**
   * Oculta el formulario modal.
   */
  hideModalForm() {
    $("#modalForm").modal("hide");
  }

  // aux 
  redirect(url: string){
    this.router.navigate([url]);
  }
}
