import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private snackBar: MatSnackBar, private firebaseService: FirebaseService, private activatedRoute: ActivatedRoute, private dataService: DataService) {

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
    return data.split("-")
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
        seller_id: this.results[0].user,
        image: this.results[0].imagePaths[0]
      }
      results.cart.push(data)
      this.firebaseService.updateUserData(results.id, results).subscribe((res) => {
        this.snackBarMessage("Item Added to Card", "Ok")
      })
    })
  }

  snackBarMessage(message: string, action = '', config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }
}
