import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  columnDefs = [
    { field: "id", headerName: "Id", sortable: true, filter: true, resizable: true },
    { field: "totalPrice", headerName: "Total Price", sortable: true, filter: true, resizable: true },
    { field: "payment", headerName: "Payment Mode", sortable: true, filter: true, resizable: true },
    { field: "shipment", headerName: "Shipping", sortable: true, filter: true, resizable: true },
    { field: "shipping", headerName: "Address", sortable: true, filter: true, resizable: true },
    {
      field: "partial_payment", headerName: "Pay", sortable: true, filter: true, resizable: true, cellRenderer: (params: any) => {
        const status = params.data.payment == 'Full';
        if (status)
          return ''
        const ele = document.createElement('p')
        ele.addEventListener('click', this.changeStatus.bind(this, params.data.id))
        ele.innerText = "Pay"
        return ele
      }
    },
  ];

  rowData: any[] = [];

  constructor(private fireBaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getUserData().subscribe((res) => {
      this.fireBaseService.getMyOrders(res[0].id).subscribe((res) => {
        const results = res.docs.map((docs: any) => {
          return { id: docs.id, ...docs.data() }
        })
        results.forEach((ele) => {
          ele["shipping"] = (ele.shipping.length) > 0 ? `${ele.shipping[0]["name"]},${ele.shipping[0]["addr1"]},${ele.shipping[0]["city"]},${ele.shipping[0]["state"]}${ele.shipping[0]["country"]},${ele.shipping[0]["zip"]}` : ''
        })
        this.rowData = results
      })
    })
  }
  changeStatus(id: string) {
    console.log(id)
  }
}



