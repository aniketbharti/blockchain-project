import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EtheriumService } from 'src/app/services/etherium.service';
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
  mode: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private etheriumService: EtheriumService, private snackBar: MatSnackBar, private firebaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit(): void {
    this.mode = this.activatedRoute.snapshot.queryParams["mode"]
    this.dataService.getUserData().subscribe((res) => {
      if (res) {
        this.userData = res
        this.getData()
      }
    })
  }

  getData() {
    this.firebaseService.checkUserExists(this.userData[0].user_wallet).subscribe((res) => {
      this.results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })[0]
      if (this.mode == 'partial') {
        this.cartItems.data = this.results.partial_cart;
        if (!(this.cartItems.data.length > 0)) {
          this.router.navigate(['/'])
        }
        this.address = this.results.address.pop()
      } else {
        this.cartItems.data = this.results.cart;
        if (!(this.cartItems.data.length > 0)) {
          this.router.navigate(['/'])
        }
        this.address = this.results.address.pop()
      }
      this.calculatePrices()
    })
  }

  placeOrder() {
    const data = {
      product: [...this.results.cart],
      shipping: [this.address],
      totalProduct: this.totalProduct,
      totalShipping: this.totalShipping,
      totalPrice: this.totalPrice,
      userId: this.results.id,
      payment: "Full",
      shipment: "Initiated",
      buyerWaller: this.results.user_wallet
    }

    this.firebaseService.placeOrder(data).subscribe((res) => {
      const data = res.id;
      let arr: any[] = []
      this.results.cart.forEach((ele: any) => {
        this.buyItem(ele.seller_id, data, ele.product_id, ele.product_title, (ele.price + ele.shipping_charges).toString(), "0", this.results.user_wallet).then((res: any) => {
          if (res !== undefined) {
            arr.push(res)
          }
        })

      })
      Promise.all(arr).then((resdata) => {
        console.log(resdata)
        this.results.cart = []
        this.results.address = []
        this.firebaseService.updateUserData(this.results.id, this.results).subscribe((res) => {
          this.snackBarMessage("Order Placed Successfully")
          this.router.navigate([`/`]);
        })
      })
    })
  }


  placePartialOrder() {
    const data = {
      product: [...this.results.partial_cart],
      shipping: [this.address],
      totalProduct: this.totalProduct,
      totalShipping: this.totalShipping,
      totalPrice: this.totalPrice,
      userId: this.results.id,
      payment: "Partial",
      shipment: "Initiated",
      buyerWaller: this.results.user_wallet,
      partial_amount: this.results.partial_cart[0].partial_amount
    }
    this.firebaseService.placeOrder(data).subscribe((res) => {
      const data = res.id;
      let arr: any[] = []
      this.results.partial_cart.forEach((ele: any) => {
        this.buyPartial(ele.seller_id, data, ele.product_id, ele.product_title, (ele.price + ele.shipping_charges).toString(), "1", this.results.user_wallet, this.results.partial_cart[0].partial_amount.toString()).then((res: any) => {
          if (res !== undefined) {
            arr.push(res)
          }
        })
      })
      Promise.all(arr).then((resdata) => {
        this.results.partial_cart = []
        this.results.address = []
        this.firebaseService.updateUserData(this.results.id, this.results).subscribe((res) => {
          this.snackBarMessage("Order Placed Successfully")
          this.router.navigate([`/`]);
        })
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

  buyItem(sellerAddress: string, id: string, productId: string, productName: string, price: string, paymentStatus: string, buyerAddress: string) {
    return this.etheriumService.buyProduct(sellerAddress, id, productId, productName, price, paymentStatus, buyerAddress)
  }

  buyPartial(sellerAddress: string, id: string, productId: string, productName: string, price: string, paymentStatus: string, buyerAddress: string, partial: string) {
    return this.etheriumService.buyProductPartial(sellerAddress, id, productId, productName, price, paymentStatus, buyerAddress, partial)
  }
}
