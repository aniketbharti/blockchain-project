import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-cousel',
  templateUrl: './main-cousel.component.html',
  styleUrls: ['./main-cousel.component.scss']
})
export class MainCouselComponent implements OnInit {
  images = ["assets/1.gif", "assets/2.jpeg", "assets/3.jpeg"];
  
  constructor() { }

  ngOnInit(): void {
  }

}
