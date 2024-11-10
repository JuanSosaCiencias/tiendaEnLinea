import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared-module';
import { CommonModule } from '@angular/common';
import { Product } from '../../_model/product';
import { ProductImage } from '../../_model/product-image';
import { SwalMessages } from '../../../../shared/swal-messages';
import { ProductImageService } from '../../_service/product-image.service';
import { ProductService } from '../../_service/product.service';
import { CurrencyFormatPipe } from '../../../../currency.pipe';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../invoice/_service/cart.service';
import { Cart } from '../../../invoice/_model/cart';

@Component({
  selector: 'app-product-image-user',
  standalone: true,
  imports: [
    SharedModule,CommonModule, CurrencyFormatPipe
  ],
  templateUrl: './product-image-user.component.html',
  styleUrl: './product-image-user.component.css'
})
export class ProductImageUserComponent  {
  gtin: string = ""; // product gtin
  product: Product = new Product();
  images: ProductImage[] = []; // images
  productImage: ProductImage = new ProductImage();
  product_id: number = 0; // product id
  cart: Cart = new Cart(); // cart
  selectedQuantity: number = 1; 

  loading = false; // loading request
  swal: SwalMessages = new SwalMessages(); // swal messages

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, // servicio product de API
    private productImageService: ProductImageService, // servicio product-image de 
    private cartService: CartService // servicio cart de API
  ) { }

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
        this.getProductImages();
        this.loading = false;
        // console.log(this.product);
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

  addToCart(product: Product, quantity: number) {
    if (quantity > product.stock) {
      this.swal.errorMessage("La cantidad seleccionada excede el stock disponible.");
      return;
    }
    // Crea un objeto Cart basado en la información del producto
    this.loading = true;  
    this.cart.gtin = product.gtin;
    this.cart.quantity = quantity;
    this.product.stock = product.stock - quantity;
    console.log(this.cart);
    // Llama al servicio para agregar al carrito
    this.cartService.addToCart(this.cart).subscribe({
      next: (v) => {
        this.loading = false;
        this.swal.successMessage("Agregados "+ quantity + " productos al carrito");
      },
      error: (e) => {
        this.loading = false;
        console.error(e);
        this.swal.errorMessage("Error al agregar producto al carrito");
      }
    });
  }
  


}
