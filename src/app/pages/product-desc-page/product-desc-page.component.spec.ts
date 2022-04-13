import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDescPageComponent } from './product-desc-page.component';

describe('ProductDescPageComponent', () => {
  let component: ProductDescPageComponent;
  let fixture: ComponentFixture<ProductDescPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDescPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDescPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
