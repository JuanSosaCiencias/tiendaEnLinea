import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../_service/customer.service';
import { SwalMessages } from '../../../../shared/swal-messages';
import { Customer } from '../../_model/customer';
import { CustomerImageService } from '../../_service/customer-image.service';
import { SharedModule } from '../../../../shared/shared-module';
import { NgxPhotoEditorService } from 'ngx-photo-editor';
import { CustomerImage } from '../../_model/customer-image';
@Component({
  selector: 'app-customer-image',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-image.component.html',
  styleUrl: './customer-image.component.css'
})
export class CustomerImageComponent {
  rfc: string = ""; // customer rfc
  customer: Customer = new Customer();
  loading = false; // loading request
  swal: SwalMessages = new SwalMessages(); // swal messages
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService, // servicio customer de API
    private customerImageService: CustomerImageService,
    private ngxService: NgxPhotoEditorService,
    private router: Router,
  ){}
  ngOnInit(){
    this.rfc = this.route.snapshot.paramMap.get('rfc')!;
    if(this.rfc){
      this.getCustomer();
    }else{
      this.swal.errorMessage("RFC inválido"); 
    }
  }
  getCustomer(){
    this.loading = true;
    this.customerService.getCustomer(this.rfc).subscribe({
      next: (v) => {
        this.customer = v;
        this.loading = false;
        console.log(this.customer);
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }
  updateCustomerImage(image: string){
    // creamos el objeto customer image
    let customerImage: CustomerImage = new CustomerImage();
    customerImage.customer_image_id = this.customer.image.customer_image_id;
    customerImage.image = image;
 
    // enviamos la imagen a la API
    this.customerImageService.updateCustomerImage(customerImage).subscribe({
      next: (v) => {
        this.swal.successMessage(v.message);
        this.getCustomer();
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error.message);
      }
    });
  }
  // image 
  fileChangeHandler($event: any) {
    this.ngxService.open($event, {
      aspectRatio: 1 / 1,
      autoCropArea: 1,
      resizeToWidth: 360,
      resizeToHeight: 360,
    }).subscribe(data => {
      this.updateCustomerImage(data.base64!);
    });
  }
  // aux 
  redirect(url: string){
    this.router.navigate([url]);
  }
}