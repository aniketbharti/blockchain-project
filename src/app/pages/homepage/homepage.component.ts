import { Component, OnInit } from '@angular/core';
import { CourouselDataInterface } from 'src/app/components/product-corousel/product.corousel.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  images = [944, 1011, 984, 222, 444].map((n) => `https://picsum.photos/id/${n}/900/500`);
  topTrending: CourouselDataInterface = {} as CourouselDataInterface
  recentlyAdded: CourouselDataInterface = {} as CourouselDataInterface

  constructor() { }

  ngOnInit(): void {
    this.recentlyAdded.heading = "Recently Added"
    this.recentlyAdded.data = this.images
    this.topTrending.heading = "Top Trending"
    this.topTrending.data = this.images
  }

}
