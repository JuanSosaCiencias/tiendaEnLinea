import { Routes } from '@angular/router';

// Traemos el componente que hicimos en los pasos anteriores
import { CategoryComponent } from './modules/product/component/category/category.component';

// Importamos los componentes del consumidor
import { CustomerComponent } from './modules/customer/component/customer/customer.component';
import { CustomerImageComponent } from './modules/customer/component/customer-image/customer-image.component';

// Importamos los componentes del producto
import { ProductComponent } from './modules/product/component/product/product.component';
import { ProductImageComponent } from './modules/product/component/product-image/product-image.component';
import { HomeComponent } from './modules/layout/component/home/home.component';
import { InvoiceDetailComponent } from './modules/invoice/component/invoice-detail/invoice-detail.component';
import { InvoiceComponent } from './modules/invoice/component/invoice/invoice.component';
import { ProductImageUserComponent } from './modules/product/component/product-image-user/product-image-user.component';
import { UserCategoryComponent } from './modules/product/component/user-category/user-category.component';

export const routes: Routes = [
    {
        path : '',
        component : HomeComponent
    },
    {
        path: 'userProduct/:gtin',
        component: ProductImageUserComponent
    },
    { 
        path: "category", 
        component: CategoryComponent 
    },
    { 
        path: "category/:category_id", 
        component: UserCategoryComponent 
    },
    {
        path: 'customer',
        component: CustomerComponent
    },
    {
        path: 'customer/:rfc',
        component: CustomerImageComponent
    },
    {
        path: 'product',
        component: ProductComponent 
    },
    {
        path: 'product/:gtin',
        component: ProductImageComponent
    },
    {
        path: 'invoice',
        component: InvoiceComponent
    },
    {
        path: 'invoice/:id',
        component: InvoiceDetailComponent
    },
    // {
    //     path: 'secured',
    //     component: SecuredComponent, 
    //     // canActivate: [authenticationGuard]
    // }
];
