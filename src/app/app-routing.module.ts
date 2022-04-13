import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ProductDescPageComponent } from './pages/product-desc-page/product-desc-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'product-details', component: ProductDescPageComponent },
  { path: 'cart', component: CartPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
