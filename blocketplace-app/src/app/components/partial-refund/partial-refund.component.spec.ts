import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialRefundComponent } from './partial-refund.component';

describe('PartialRefundComponent', () => {
  let component: PartialRefundComponent;
  let fixture: ComponentFixture<PartialRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialRefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
