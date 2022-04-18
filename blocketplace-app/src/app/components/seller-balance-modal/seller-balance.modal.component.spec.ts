import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBalanceModalComponent } from './seller-balance.modal.component';

describe('RegisterModalComponent', () => {
    let component: SellerBalanceModalComponent;
    let fixture: ComponentFixture<SellerBalanceModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SellerBalanceModalComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SellerBalanceModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
