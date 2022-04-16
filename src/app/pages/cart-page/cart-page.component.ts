import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  userData: any;
  cartItems: any[] = []
  totalProduct: number = 0;
  totalShipping: number = 0;
  totalPrice: number = 0;
  results: any;

  constructor(private snackBar: MatSnackBar, private firebaseService: FirebaseService, private dataService: DataService) { }

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
      this.cartItems = this.results.cart;
      this.calculatePrices()
    })
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1)
    this.firebaseService.updateUserData(this.userData[0].id, this.results).subscribe((res) => {
      this.snackBarMessage("Item Deleted Successfully")
      this.calculatePrices()

    })
  }

  calculatePrices() {
    this.totalShipping = 0
    this.totalProduct = 0
    this.cartItems.forEach((ele) => {
      this.totalProduct += ele.price
      this.totalShipping += ele.shipping_charges
    })
    this.totalPrice = this.totalProduct + this.totalShipping
  }

  snackBarMessage(message: string, action = '', config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }

}
