import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from "lodash";

@Component({
  selector: 'app-product-corousel',
  templateUrl: './product.corousel.component.html',
  styleUrls: ['./product.corousel.component.scss']
})
export class ProductCorouselComponent implements OnInit {
  result: any[][] = []

  @Input() courouselData: CourouselDataInterface | null = null;

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {

    this.breakpointObserver.observe([
      "(max-width: 1020px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        if (this.courouselData?.data) {
          this.result = this.partition(this.courouselData?.data, 1)
        }
      } else {
        if (this.courouselData?.data) {
          this.result = this.partition(this.courouselData?.data, 3)
        }
      }
    });

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


export interface CourouselDataInterface { heading: string, data: any[] }
