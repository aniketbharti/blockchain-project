import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosuggestSearchComponent } from './autosuggest-search.component';

describe('AutosuggestSearchComponent', () => {
  let component: AutosuggestSearchComponent;
  let fixture: ComponentFixture<AutosuggestSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutosuggestSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosuggestSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
