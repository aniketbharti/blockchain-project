import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnInit {

  @Input() item: { removeButtonDisplay: boolean, data: any[] } = { removeButtonDisplay: true, data: [] }
  @Output() eventEmitterData: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  calculateTotal(price: string, shipping: string, qty: string) {
    return (parseInt(qty, 10) * (parseInt(price, 10) + parseInt(shipping, 10))).toString()
  }

  removeItem(index: number) {
    this.eventEmitterData.emit(index)
  }
}
