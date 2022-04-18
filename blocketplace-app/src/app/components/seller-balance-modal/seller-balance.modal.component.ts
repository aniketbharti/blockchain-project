import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-seller-balance-modal',
    templateUrl: './seller-balance-modal.component.html',
    styleUrls: ['./seller-balance-modal.component.scss']
})
export class SellerBalanceModalComponent {
    sellerBalanceForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<SellerBalanceModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.sellerBalanceForm = this.fb.group({
            seller_wallet: [{ value: data['seller_balance'], disabled: true }],
        });

    }

    onSubmit(): void {
        const data = this.sellerBalanceForm.getRawValue()
        this.doAction(data)
    }

    doAction(data: Object) {
        this.dialogRef.close({ event: 'seller_balance', data: data });
    }

    closeDialog() {
        this.dialogRef.close({ event: 'cancel' });
    }


    get f() {
        return this.sellerBalanceForm?.controls
    }

}
