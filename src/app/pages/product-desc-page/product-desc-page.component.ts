import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private firebaseService: FirebaseService, private activatedRoute: ActivatedRoute) {

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
  }

  getSimilarProduct(data: string) {
    this.firebaseService.similarProduct(data).subscribe((res) => {
      const results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      this.similarProduct.data = results
      console.log(this.similarProduct)
    })
  }

  getResponse(data: string) {
    return data.split("-")
  }

}
