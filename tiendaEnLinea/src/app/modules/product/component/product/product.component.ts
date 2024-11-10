import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared-module';
import { DtoProductList } from '../../_dto/dto-product-list';
import { Category } from '../../_model/category';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalMessages } from '../../../../shared/swal-messages';
import { CategoryService } from '../../_service/category.service';
import { ProductService } from '../../_service/product.service';
import { Router } from '@angular/router';

declare var $: any; // JQuery
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  
  products: DtoProductList[] = []; // product list
  categories: Category[] = []; // category list
  // Product form
  form : FormGroup;
  current_date = new Date(); // hora y fecha actual
  loading = false; // loading request
  submitted = false; // Form submitted
  swal: SwalMessages = new SwalMessages(); // swal messages
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
  ){
    this.form = this.formBuilder.group({
      product: ["", [Validators.required]],
      gtin: ["", [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      description: ["", [Validators.required]],
      price: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      stock: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      category_id: [0, [Validators.required]],
    });
  }
  ngOnInit(){
    this.getProducts();
  }
  disableProduct(id: number){
    this.swal.confirmMessage.fire({
      title: "Favor de confirmar la eliminación",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.disableProduct(id).subscribe({
          next: (v) => {
            this.swal.successMessage(v.message);
            this.getProducts();
          },
          error: (e) => {
            console.error(e);
            this.swal.errorMessage(e.error.message);
          }
        });
      }
    });
  }
  enableProduct(id: number){
    this.swal.confirmMessage.fire({
      title: "Favor de confirmar la activación",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.enableProduct(id).subscribe({
          next: (v) => {
            this.swal.successMessage(v.message);
            this.getProducts();
          },
          error: (e) => {
            console.error(e);
            this.swal.errorMessage(e.error.message);
          }
        });
      }
    });
  }
  getProducts(){
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (v) => {
        this.products = v;
        this.loading = false;
        this.current_date = new Date();
      },
      error: (e) => {
        this.loading = false;
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }
  onSubmit(){
    // validate form
    this.submitted = true;
    if(this.form.invalid) return;
    this.submitted = false;
    this.productService.createProduct(this.form.value).subscribe({
      next: (v) => {
        this.swal.successMessage(v.message); // show message
        this.getProducts(); // reload products
        this.hideModalForm(); // close modal
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }
  // modals 
  showModalForm(){
    $("#modalForm").modal("show");
    this.getActiveCategories();
    this.form.reset();
    this.submitted = false;
  }
  hideModalForm(){
    $("#modalForm").modal("hide");
  }
  // catalogues 
  getActiveCategories(){
    this.categoryService.getActiveCategories().subscribe({
      next: (v) => {
        this.categories = v;
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  showProduct(gtin: string){
    this.router.navigate(['product/' + gtin]);
  }
}