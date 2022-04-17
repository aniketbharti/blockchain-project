import { Component, OnInit } from '@angular/core';
import { CourouselDataInterface } from 'src/app/components/product-corousel/product.corousel.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  topTrending: CourouselDataInterface = {
    heading: "",
    data: []
  }
  recentlyAdded: CourouselDataInterface = {
    heading: "",
    data: []
  }
  results1: any[] = [];
  results2: any[] = [];

  constructor(private fireBaseService: FirebaseService) { }

  ngOnInit(): void {
    this.fireBaseService.getTrendyProducts().subscribe((res) => {
      this.results1 = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      this.recentlyAdded.data = this.results1
      this.topTrending.heading = "Top Trending"
      this.topTrending.data = this.results1
    })

    this.fireBaseService.getRecentlyAddedProducts().subscribe((res) => {
      this.results2 = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      this.recentlyAdded.heading = "Recently Added"
      this.recentlyAdded.data = this.results2
      console.log(this.results2)
    })
  }



}
