import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-review-cart',
  templateUrl: './review-cart.component.html',
  styleUrls: ['./review-cart.component.scss']
})

export class ReviewCartComponent implements OnInit {

  userData: any;
  cartItems: { removeButtonDisplay: boolean, data: any[] } = { removeButtonDisplay: false, data: [] }
  totalProduct: number = 0;
  totalShipping: number = 0;
  totalPrice: number = 0;
  results: any;
  address: any;

  constructor(private router: Router, private snackBar: MatSnackBar, private firebaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit(): void {
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
      this.cartItems.data = this.results.cart;
      this.address = this.results.address.pop()
      this.calculatePrices()
    })
  }

  placeOrder() {
    const data = {
      product: [...this.results.cart],
      shipping: [...this.results.address],
      totalProduct: this.totalProduct,
      totalShipping: this.totalShipping,
      totalPrice: this.totalPrice,
      userId: this.results.id,
      payment: "Full",
      shipment: "Initiated"
    }
    this.firebaseService.placeOrder(data).subscribe((res) => {
      this.results.cart = []
      this.results.address = []
      this.firebaseService.updateUserData(this.results.id, this.results).subscribe((res) => {
        this.snackBarMessage("Order Placed Successfully")
        this.router.navigate([`/`]);
      })
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

  snackBarMessage(message: string, action = '', config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }

}
