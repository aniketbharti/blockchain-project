import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { EtheriumService } from 'src/app/services/etherium.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-partial-refund',
  templateUrl: './partial-refund.component.html',
  styleUrls: ['./partial-refund.component.scss']
})
export class PartialRefundComponent implements OnInit {

  columnDefs = [
    { field: "orderid", headerName: "Id", sortable: true, filter: true, resizable: true },
    { field: "buyerid", headerName: "Buyer Id", sortable: true, filter: true, resizable: true },
    { field: "productid", headerName: "Product Id", sortable: true, filter: true, resizable: true },
    { field: "price", headerName: "Price", sortable: true, filter: true, resizable: true },
    { field: "partial_amout", headerName: "Partial Amount", sortable: true, filter: true, resizable: true },
    { field: "shipping", headerName: "Shipping", sortable: true, filter: true, resizable: true },
    {
      field: "refund", headerName: "Refund", sortable: true, filter: true, resizable: true, cellRenderer: (params: any) => {
        const ele = document.createElement('p')
        ele.addEventListener('click', this.changeStatus.bind(this, params.data))
        ele.innerText = "Refund"
        return ele
      }
    },

  ];
  userData: any;

  constructor(private snackBar: MatSnackBar, private fireBaseService: FirebaseService, private userDataService: DataService, private etheriumService: EtheriumService) { }
  rowData: any[] = []

  ngOnInit(): void {
    this.userDataService.getUserData().subscribe((res) => {
      this.userData = res
      this.getPartialOrders()
    })
  }

  getPartialOrders() {
    this.rowData = []
    this.fireBaseService.getPartialOrders().subscribe((res) => {
      let results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      const datalist: any[] = []
      results.forEach((ele) => {
        const data = {
          orderid: ele.id,
          buyerid: ele.userId,
          productid: ele.product[0].product_id,
          price: ele.totalPrice,
          partial_amout: ele.partial_amount,
          shipping: (ele.shipping.length) > 0 ? `${ele.shipping[0]["name"]},${ele.shipping[0]["addr1"]},${ele.shipping[0]["city"]},${ele.shipping[0]["state"]}${ele.shipping[0]["country"]},${ele.shipping[0]["zip"]}` : '',
          walletBuyer: ele.buyerWaller
        }
        datalist.push(data)
        this.rowData = datalist
      })
    })
  }

  changeStatus(data: any) {
    this.etheriumService.refund(data.orderid, data.walletBuyer, this.userData[0].user_wallet, data.partial_amout.toString()).then((res: any) => {
      if (res !== undefined) {
        console.log(res)
        this.fireBaseService.searchSpecificOrder(data.orderid).subscribe((res2) => {
          const results: any = res2.docs.map((docs: any) => {
            return { id: docs.id, ...docs.data() }
          })
          results[0].payment = "Refund"
          this.fireBaseService.updateOrder(results[0].id, results[0]).subscribe((res: any) => {
            this.snackBar.open("Refund Processed Sucessfully")
            this.getPartialOrders()
          })
        })
      } else {
        alert("Error while Refund")
      }
    })
  }

  snackBarMessage(message: string, action = '') {
    const config = {
      duration: 3000
    }
    return this.snackBar.open(message, action, config);
  }
}
