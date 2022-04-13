import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-image-corousel',
  templateUrl: './multi-image-corousel.component.html',
  styleUrls: ['./multi-image-corousel.component.scss']
})
export class MultiImageCorouselComponent implements OnInit {

  result: any[][] = []

  @Input() courouselData: any[] = [];
  displayImage: any[] = [];

  constructor() { }

  ngOnInit(): void {

    if (this.courouselData) {
      this.displayImage = this.courouselData[0]
      this.result = this.partition(this.courouselData, 4)
    }

  }

  partition(items: any[], n: number) {
    const res = items.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / n)
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])
    return res
  }
}
