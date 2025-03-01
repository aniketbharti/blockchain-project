import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  userData: any;
  cartItems: { removeButtonDisplay: boolean, data: any[] } = { removeButtonDisplay: true, data: [] }
  totalProduct: number = 0;
  totalShipping: number = 0;
  totalPrice: number = 0;
  results: any;
  emptyCart: boolean | undefined;
  mode: any;

  constructor(private snackBar: MatSnackBar, private router: Router, private activatedRoutes: ActivatedRoute, private firebaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit(): void {
    this.mode = this.activatedRoutes.snapshot.queryParams["mode"]
    console.log(this.mode)
    this.dataService.getUserData().subscribe((res) => {
      this.userData = res
      this.getData()
    })
  }

  getData() {
    this.firebaseService.checkUserExists(this.userData[0].user_wallet).subscribe((res) => {
      this.results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })[0]
      
      if (!(this.mode == 'partial')) {
        this.cartItems.data = this.results.cart;
        if (this.cartItems.data.length > 0) {
          this.emptyCart = false
        } else {
          this.emptyCart = true
        }
      } else {
        this.cartItems.data = this.results.partial_cart;
        if (!(this.cartItems.data.length > 0)) {
          this.router.navigate(['/'])
        }
        this.cartItems.removeButtonDisplay = false
        this.emptyCart = false
      }

      this.calculatePrices()
    })
  }

  removeItem(index: number) {
    this.cartItems.data.splice(index, 1)
    this.firebaseService.updateUserData(this.userData[0].id, this.results).subscribe((res) => {
      this.snackBarMessage("Item Deleted Successfully")
      if (this.cartItems.data.length == 0) {
        this.emptyCart = true
      } else {
        this.emptyCart = false
      }
      this.calculatePrices()
    })
  }

  calculatePrices() {
    this.totalShipping = 0
    this.totalProduct = 0
    this.cartItems.data.forEach((ele) => {
      this.totalProduct += ele.price
      this.totalShipping += ele.shipping_charges
    })
    this.totalPrice = this.totalProduct + this.totalShipping
  }

  snackBarMessage(message: string, action = '') {
    const config = {
      duration: 3000
    }
    return this.snackBar.open(message, action, config);
  }

  checkOut() {
    if (this.mode == 'partial') {
      this.router.navigate(['/shipping-details'], { queryParams: { mode: 'partial' } })
    } else {
      this.router.navigate(['/shipping-details'])
    }
  }

  
}
