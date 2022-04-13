import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-desc-page',
  templateUrl: './product-desc-page.component.html',
  styleUrls: ['./product-desc-page.component.scss']
})
export class ProductDescPageComponent implements OnInit {
  images = [944, 1011, 984, 222, 444].map((n) => `https://picsum.photos/id/${n}/900/500`);

  imgSlides = [
    "assets/images/shoes.jpg",
    "assets/images/shoes_2.jpg",
    "assets/images/shoes.jpg",
    "assets/images/shoes_2.jpg"
  ];
  similarProduct = {
    heading: "Similar Products",
    data: this.imgSlides
  }
  image = {
    data: this.images
  }
  constructor() { }

  ngOnInit(): void {
  }

}
