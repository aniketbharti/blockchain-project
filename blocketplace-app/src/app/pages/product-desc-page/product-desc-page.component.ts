import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PartialPaymentFormComponent } from 'src/app/components/partial-payment-form/partial-payment-form.component';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-product-desc-page',
  templateUrl: './product-desc-page.component.html',
  styleUrls: ['./product-desc-page.component.scss']
})
export class ProductDescPageComponent implements OnInit {

  similarProduct: { heading: string, data: any[] } = {
    heading: "Similar Products",
    data: []
  }
  results: any[] = [];
  images: any[] = [];
  userData: any;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router, private firebaseService: FirebaseService, private activatedRoute: ActivatedRoute, private dataService: DataService) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((res) => {
      const id = res["id"]
      this.similarProduct.data = []
      this.images = []
      this.firebaseService.searchSpecificProduct(id).subscribe(res => {
        this.results = res.docs.map((docs: any) => {
          return { id: docs.id, ...docs.data() }
        })
        this.images = this.results[0].imagePaths
        this.getSimilarProduct(this.results[0].product_subcategory)
      })
    })
    this.dataService.getUserData().subscribe((data) => {
      this.userData = data
    })
  }

  getSimilarProduct(data: string) {
    this.firebaseService.similarProduct(data).subscribe((res) => {
      const results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      this.similarProduct.data = results
    })
  }

  getResponse(data: string) {
    return data.split("*")
  }


  addToCart() {
    this.firebaseService.checkUserExists(this.userData[0].user_wallet).subscribe((res) => {
      const results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })[0]
      const data = {
        product_title: this.results[0].product_title,
        product_desc: this.results[0].product_desc,
        shipping_charges: this.results[0].shipping_charges,
        price: this.results[0].price,
        product_quantity: this.results[0].product_quantity,
        seller_id: this.results[0].wallet,
        image: this.results[0].imagePaths[0],
        product_id: this.results[0].id
      }
      results.cart.push(data)
      this.firebaseService.updateUserData(results.id, results).subscribe((res) => {
        this.snackBarMessage("Item Added to Card", "Ok")
      })
    })
  }


  addToParitial() {
    const dialogRef = this.dialog.open(PartialPaymentFormComponent, {
      width: '370px',
      height: '290px'
    });
    dialogRef.afterClosed().subscribe(mres => {
      if (mres && mres.button == "Ok") {
        this.firebaseService.checkUserExists(this.userData[0].user_wallet).subscribe((res) => {
          const results = res.docs.map((docs: any) => {
            return { id: docs.id, ...docs.data() }
          })[0]
          const data = {
            product_title: this.results[0].product_title,
            product_desc: this.results[0].product_desc,
            shipping_charges: this.results[0].shipping_charges,
            price: this.results[0].price,
            product_quantity: this.results[0].product_quantity,
            seller_id: this.results[0].wallet,
            image: this.results[0].imagePaths[0],
            product_id: this.results[0].id, 
            partial_amount: mres.data
          }
          results.partial_cart = [data]
          this.firebaseService.updateUserData(results.id, results).subscribe((res) => {
            this.router.navigate(['/partial-order'], { queryParams: { mode: 'partial' } })
          })
        })
      }
    });

  }

  snackBarMessage(message: string, action = '', config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }
}
