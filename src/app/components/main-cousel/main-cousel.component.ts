import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-cousel',
  templateUrl: './main-cousel.component.html',
  styleUrls: ['./main-cousel.component.scss']
})
export class MainCouselComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor() { }

  ngOnInit(): void {
  }

}
