import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCouselComponent } from './main-cousel.component';

describe('MainCouselComponent', () => {
  let component: MainCouselComponent;
  let fixture: ComponentFixture<MainCouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
