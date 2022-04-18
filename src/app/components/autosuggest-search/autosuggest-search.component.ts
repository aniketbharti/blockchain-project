import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-autosuggest-search',
  templateUrl: './autosuggest-search.component.html',
  styleUrls: ['./autosuggest-search.component.scss']
})

export class AutosuggestSearchComponent implements OnInit {
  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<string[]> | undefined;

  constructor(private fireBaseService: FirebaseService) { }

  ngOnInit() {

    this.fireBaseService.searchProduct().subscribe((res) => {
      const data = res.docs.map((docs: any) => {
        return docs.data()
      })
      data.forEach((ele) => {
        this.options.push(["product_category", ele.product_category])
        this.options.push(["product_subcategory", ele.product_subcategory])
        this.options.push(["product_title", ele.product_title])
      })
      const val = new Set(this.options)
      this.options = Array.from(val)
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.options.filter(option => (option[1] || '' ).toLowerCase().includes(filterValue));
  }


}
