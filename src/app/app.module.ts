import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductCorouselComponent } from './components/product-corousel/product.corousel.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ProductDescPageComponent } from './pages/product-desc-page/product-desc-page.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainCouselComponent } from './components/main-cousel/main-cousel.component';
import { AutosuggestSearchComponent } from './components/autosuggest-search/autosuggest-search.component';
import { MultiImageCorouselComponent } from './components/multi-image-corousel/multi-image-corousel.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { SellerBalanceModalComponent } from './components/seller-balance-modal/seller-balance.modal.component';
import { MessageModalComponent } from './components/modal/message.modal.component';
import { PostProductComponent } from './pages/post-product/post-product.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { CartItemsComponent } from './components/cart-items/cart-items.component';
import { ShippingPageComponent } from './pages/shipping-page/shipping-page.component';
import { ReviewCartComponent } from './pages/review-cart/review-cart.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductCorouselComponent,
    HomepageComponent,
    SearchPageComponent,
    ProductDescPageComponent,
    AutosuggestSearchComponent,
    FiltersComponent,
    FooterComponent,
    HeaderNavComponent,
    MainCouselComponent,
    MultiImageCorouselComponent,
    CartPageComponent,
    RegisterModalComponent,
    SellerBalanceModalComponent,
    MessageModalComponent,
    PostProductComponent,
    CartItemsComponent,
    ShippingPageComponent,
    ReviewCartComponent,
    MyProductsComponent,
    MyOrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    NgbModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
