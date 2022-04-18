import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCorouselComponent } from './product.corousel.component';

describe('ProductCorouselComponent', () => {
  let component: ProductCorouselComponent;
  let fixture: ComponentFixture<ProductCorouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCorouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCorouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
