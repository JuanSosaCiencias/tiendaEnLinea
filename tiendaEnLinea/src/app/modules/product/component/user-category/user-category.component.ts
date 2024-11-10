import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductService } from '../../_service/product.service';
import { ProductImageService } from '../../_service/product-image.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalMessages } from '../../../../shared/swal-messages';
import { Product } from '../../_model/product';
import { CurrencyFormatPipe } from '../../../../currency.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../_service/category.service';
import { Category } from '../../_model/category';

@Component({
  selector: 'app-user-category',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './user-category.component.html',
  styleUrl: './user-category.component.css'
})
export class UserCategoryComponent {
  loading = false;
  swal: SwalMessages = new SwalMessages();
  category_id: number = 0;
  category : Category = new Category(0, '', '', 0);
  products: Product[] = [];
  productImages: { [key: number]: string } = {}; 
  page: number = 1;
  itemsPerPage: number = 12;

  constructor(
    private productService: ProductService,
    private productImageService: ProductImageService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const categoryId = parseInt(params.get('category_id')!, 10);
      if (categoryId) {
        this.category_id = categoryId;
        this.getProductsByCategory();
        this.getCategory();
        this.loading = false;
      } else {
        this.swal.errorMessage("category_id inválido");
        this.loading = false;
      }
    });
  }
  

  getCategory(){
    this.categoryService.getCategory(this.category_id).subscribe({
      next: (v) => {
        this.category = v;
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.products.forEach(product => {
      if (this.productImages[product.product_id]) {
        this.setImageBackgroundColor(this.productImages[product.product_id], product.product_id);
      }
    });
  }


  onPageChange(newPage: number): void {
    this.page = newPage;
    // Vuelve a aplicar el fondo a las tarjetas en la nueva página
    setTimeout(() => {
      this.products.forEach(product => {
        if (this.productImages[product.product_id]) {
          this.setImageBackgroundColor(this.productImages[product.product_id], product.product_id);
        }
      });
    }, 0);
  }

  getProductsByCategory(){
    this.productService.getProductsByCategory(this.category_id).subscribe({
      next: (v) => {
        console.log(v);
        this.products = v;
        this.loadProductImages();
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        console.error(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  loadProductImages(): void {
    this.products.forEach(product => {
      this.productImageService.getProductImages(product.product_id).subscribe({
        next: (images) => {
          if (images && images.length > 0) {
            this.productImages[product.product_id] = images[0].image;
            this.setImageBackgroundColor(images[0].image, product.product_id);
          } else {
            this.productImages[product.product_id] = '/assets/product-default.jpg';
          }
        },
        error: (e) => {
          console.error(e);
          this.productImages[product.product_id] = '/assets/product-default.jpg';
        }
      });
    });
  }

  setImageBackgroundColor(imageSrc: string, productId: number): void {
    const img = new Image();
    img.src = imageSrc;
  
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, 1, 1).data; // Color de la esquina superior izquierda
        const backgroundColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
        const complementColor = `rgb(${255 - data[0]}, ${255 - data[1]}, ${255 - data[2]})`;
  
        // Aplica el color de fondo a la tarjeta
        const cardElement = document.getElementById(`card-${productId}`);
        cardElement?.style.setProperty('background-color', backgroundColor);
  
        // Aplica el color complementario al texto dentro de la tarjeta
        cardElement?.querySelectorAll('.card-body, .card-body h5, .card-body p').forEach((textElement) => {
          (textElement as HTMLElement).style.color = complementColor;
        });
      }
    };
  }

  showProduct(gtin: string){
    this.router.navigate(['userProduct/' + gtin]);
  }
}
