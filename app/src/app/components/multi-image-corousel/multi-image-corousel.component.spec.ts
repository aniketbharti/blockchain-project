import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiImageCorouselComponent } from './multi-image-corousel.component';

describe('MultiImageCorouselComponent', () => {
  let component: MultiImageCorouselComponent;
  let fixture: ComponentFixture<MultiImageCorouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiImageCorouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiImageCorouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
