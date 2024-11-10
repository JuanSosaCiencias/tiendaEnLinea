import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Product } from '../../../product/_model/product';
import { ProductService } from '../../../product/_service/product.service';
import { SwalMessages } from '../../../../shared/swal-messages';
import { CommonModule } from '@angular/common';
import { ProductImageService } from '../../../product/_service/product-image.service';
import { CurrencyFormatPipe } from '../../../../currency.pipe';
import { NgxPaginationModule } from 'ngx-pagination';  // Importa el módulo de paginación
import { AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Agregar CUSTOM_ELEMENTS_SCHEMA si es necesario
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  products: Product[] = [];
  productImages: { [key: number]: string } = {}; // Aquí almacenamos las imágenes por product_id
  loading = false; // loading request
  swal: SwalMessages = new SwalMessages(); // swal messages
  page: number = 1; // Página actual
  itemsPerPage: number = 8; // Productos por página

  constructor(
    private productService: ProductService,
    private productImageService: ProductImageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getActiveProducts().subscribe({
      next: (v) => {
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
   
  // Metodo que se ejecuta después de que se actualiza la vista 
  ngAfterViewChecked(): void {
    this.products.forEach(product => {
      if (this.productImages[product.product_id]) {
        this.setImageBackgroundColor(this.productImages[product.product_id], product.product_id);
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

  // Método que se ejecuta cuando se cambia de página para cambiar el color
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
  