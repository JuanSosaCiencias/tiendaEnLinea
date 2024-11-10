import { Component } from '@angular/core';
import { Category } from '../../../product/_model/category';
import { SwalMessages } from '../../../../shared/swal-messages';
import { CategoryService } from '../../../product/_service/category.service';
import { AuthenticationService } from '../../../auth/_service/authentication.service';
import { LoginComponent } from "../../../auth/component/login/login.component";
import { RegisterComponent } from "../../../auth/component/register/register.component";
import { SharedModule } from '../../../../shared/shared-module';
import { Router } from '@angular/router';
declare var $: any; // JQuery
@Component({
  selector: 'app-navbar2',
  standalone: true,
  imports: [
    SharedModule, 
    LoginComponent, 
    RegisterComponent
  ],
  templateUrl: './navbar2.component.html',
  styleUrl: './navbar2.component.css'
})
export class Navbar2Component {
  categories: Category[] = []; // categories list
  loggedIn = false;
  isAdmin = false;
  swal: SwalMessages = new SwalMessages(); // swal messages
  constructor(
    private categoryService: CategoryService,
    private servicioAutenticacion: AuthenticationService,
    private router: Router,
  ){}
  ngOnInit(){
    if(localStorage.getItem("token")){
      this.loggedIn = true;
    }
    if(localStorage.getItem("user")){
      let user = JSON.parse(localStorage.getItem("user")!);
      if(user.rol == "ADMIN"){
        this.isAdmin = true;
      }else{
        this.isAdmin = false;
      }
    }
    this.getCategories();
  }
  getCategories(){
    this.categoryService.getActiveCategories().subscribe({
      next: (v) => {
        this.categories = v;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }
  logout(){
    this.servicioAutenticacion.logOut();
    this.loggedIn = false;
    window.location.reload();
  }

  showCategoryProducts(category_id: number){
    this.router.navigate(['category/' + category_id]);
  }

  showLoginModal(){
    $("#loginModal").modal("show");
  }
  showRegisterModal(){
    $("#registerModal").modal("show");
  }
}