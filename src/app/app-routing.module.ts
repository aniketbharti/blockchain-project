import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { PostProductComponent } from './pages/post-product/post-product.component';
import { ProductDescPageComponent } from './pages/product-desc-page/product-desc-page.component';
import { ReviewCartComponent } from './pages/review-cart/review-cart.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ShippingPageComponent } from './pages/shipping-page/shipping-page.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'product-details', component: ProductDescPageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: "post-product", component: PostProductComponent },
  { path: "shipping-details", component: ShippingPageComponent },
  { path: "shipping-details", component: ShippingPageComponent },
  { path: "review-cart", component: ReviewCartComponent },
  { path: "my-products", component: MyProductsComponent },
  { path: "my-orders", component: MyOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
