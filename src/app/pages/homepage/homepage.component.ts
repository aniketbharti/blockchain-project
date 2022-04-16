import { Component, OnInit } from '@angular/core';
import { CourouselDataInterface } from 'src/app/components/product-corousel/product.corousel.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  // images = [944, 1011, 984, 222, 444].map((n) => `https://picsum.photos/id/${n}/900/500`);
  topTrending: CourouselDataInterface = {} as CourouselDataInterface
  recentlyAdded: CourouselDataInterface = {} as CourouselDataInterface
  results: any[] = [];

  constructor(private fireBaseService: FirebaseService) { }

  ngOnInit(): void {
    this.fireBaseService.getTrendyProducts().subscribe((res) => {
      this.results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      console.log(this.results)
      this.recentlyAdded.heading = "Recently Added"
      this.recentlyAdded.data = this.results
      this.topTrending.heading = "Top Trending"
      this.topTrending.data = this.results
    })
  }



}
