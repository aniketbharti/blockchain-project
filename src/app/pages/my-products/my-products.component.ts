import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  columnDefs = [
    { field: "id", headerName: "Id", sortable: true, filter: true, resizable: true },
    { field: "product_title", headerName: "Product Title", sortable: true, filter: true, resizable: true },
    { field: "product_category", headerName: "Product Category", sortable: true, filter: true, resizable: true },
    { field: "product_subcategory", headerName: "Product Sub Category", sortable: true, filter: true, resizable: true },
    { field: "condition", headerName: "Condition", sortable: true, filter: true, resizable: true },
    { field: "price", headerName: "Price (WEI)", sortable: true, filter: true, resizable: true },
    { field: "product_quantity", headerName: "Quantity", sortable: true, filter: true, resizable: true },
    { field: "shipping_charges", headerName: "Shipping (WEI)", sortable: true, filter: true, resizable: true },
    { field: "Delete" }
  ];

  rowData: any[] = [];

  constructor(private fireBaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getUserData().subscribe((res) => {
      this.fireBaseService.getMyProduct(res[0].id).subscribe((res) => {
        const results = res.docs.map((docs: any) => {
          return { id: docs.id, ...docs.data() }
        })

        this.rowData = results
      })
    })
  }


}
