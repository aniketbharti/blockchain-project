import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { PartialPaymentFormComponent } from 'src/app/components/partial-payment-form/partial-payment-form.component';
import { DataService } from 'src/app/services/data.service';
import { EtheriumService } from 'src/app/services/etherium.service';
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
    { field: "partial_amount", headerName: "Partial Amount", sortable: true, filter: true, resizable: true },
    { field: "payment", headerName: "Payment Mode", sortable: true, filter: true, resizable: true },
    { field: "shipment", headerName: "Shipping", sortable: true, filter: true, resizable: true },
    { field: "shipping", headerName: "Address", sortable: true, filter: true, resizable: true },
    {
      field: "partial_payment", headerName: "Pay Remaining", sortable: true, filter: true, resizable: true, cellRenderer: (params: any) => {
        const status = params.data.payment == 'Full' || params.data.payment == 'Refund';
        if (status)
          return ''
        const ele = document.createElement('p')
        ele.addEventListener('click', this.changeStatus.bind(this, params.data))
        ele.innerText = "Pay"
        return ele
      }
    },
  ];

  rowData: any[] = [];
  userData: any;

  constructor(private etheriumService: EtheriumService, private snackBar: MatSnackBar, private fireBaseService: FirebaseService, private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataService.getUserData().subscribe((res) => {
      this.userData = res
      this.getData()

    })
  }

  getData() {
    this.rowData = []
    this.fireBaseService.getMyOrders(this.userData[0].id).subscribe((res) => {
      const results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })
      results.forEach((ele) => {
        ele["partial_amount"] = ele?.partial_amount ? ele.partial_amount : 'NA'
        ele["shipping"] = (ele.shipping.length) > 0 ? `${ele.shipping[0]["name"]},${ele.shipping[0]["addr1"]},${ele.shipping[0]["city"]},${ele.shipping[0]["state"]}${ele.shipping[0]["country"]},${ele.shipping[0]["zip"]}` : ''
      })
      this.rowData = results
    })
  }


  changeStatus(rowdata: any) {
    const dialogRef = this.dialog.open(PartialPaymentFormComponent, {
      width: '370px',
      height: '290px'
    });
    dialogRef.afterClosed().subscribe(mres => {
      if (mres.button == "Ok") {
        if (mres.data > 0) {
          Promise.all([this.buyPartial(rowdata.product[0].seller_id, rowdata.id, rowdata.product[0].product_id, rowdata.product[0].product_title, rowdata.product[0].price, "1", rowdata.buyerWaller, mres.data.toString())]).then((res) => {
            this.fireBaseService.searchSpecificOrder(rowdata.id).subscribe((res2) => {
              const results: any = res2.docs.map((docs: any) => {
                return { id: docs.id, ...docs.data() }
              })
              results[0].partial_amount = results[0].partial_amount + mres.data;
              if (results[0].partial_amount >= results[0].totalPrice) {
                results[0].payment = "Full"
                results[0].partial_amount = 0
              }
              this.fireBaseService.updateOrder(results[0].id, results[0]).subscribe((res: any) => {
                this.snackBar.open("Partial Payment Recieved")
                this.getData()
              })
            })
          })
        }
      }
    })
  }

  buyPartial(sellerAddress: string, id: string, productId: string, productName: string, price: string, paymentStatus: string, buyerAddress: string, partial: string) {
    return this.etheriumService.buyProductPartial(sellerAddress, id, productId, productName, price, paymentStatus, buyerAddress, partial)
  }

  snackBarMessage(message: string, action = '') {
    const config = {
      duration: 3000
    }
    return this.snackBar.open(message, action, config);
  }

}

