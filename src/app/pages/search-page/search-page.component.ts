import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  result: any[] = []
  page = 1;
  pageSize = 9;
  results = []
  constructor(private route: ActivatedRoute, private fireBaseService: FirebaseService) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      const field = res['field']
      const value = res['search']
      this.fireBaseService.searchProductOnCondition(field, value).subscribe((res) => {
        const data = res.docs.map((docs: any) => {
          return { id: docs.id, ...docs.data() }
        })
        this.result = data;
      })
    })
  }

  findColor(data: any[]) {
    const d = data.filter(ele => ele.name === "Color")
    return d.length > 0 ? d[0].value : 'NA'
  }
}
