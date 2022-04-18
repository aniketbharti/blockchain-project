import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialPaymentFormComponent } from './partial-payment-form.component';

describe('PartialPaymentFormComponent', () => {
  let component: PartialPaymentFormComponent;
  let fixture: ComponentFixture<PartialPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialPaymentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
