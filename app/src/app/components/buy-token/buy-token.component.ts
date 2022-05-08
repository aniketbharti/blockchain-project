import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-buy-token',
  templateUrl: './buy-token.component.html',
  styleUrls: ['./buy-token.component.scss']
})
export class BuyTokenComponent {
  buyForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<BuyTokenComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.buyForm = this.fb.group({
      amount: [null, [Validators.required]],
    });
  }


  onSubmit(): void {
    if (this.buyForm.valid) {
      const data = this.buyForm.getRawValue().amount
      this.doAction(data)
    } else {
      this.buyForm.markAllAsTouched()
    }
  }

  doAction(data: Object) {
    this.dialogRef.close({ event: 'buy', amount: data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'cancel' });
  }


  get f() {
    return this.buyForm?.controls
  }

}
