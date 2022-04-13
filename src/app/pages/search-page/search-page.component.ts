import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  result = Array.from(Array(100).keys())
  page = 1;
  pageSize = 9;
  constructor() { }

  ngOnInit(): void {
  }

}
