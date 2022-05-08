import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EtheriumService } from 'src/app/services/etherium.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-airdrop',
  templateUrl: './airdrop.component.html',
  styleUrls: ['./airdrop.component.scss']
})
export class AirdropComponent {

  buyForm: FormGroup;
  balance: any;

  constructor(private etheriumService: EtheriumService, public dialogRef: MatDialogRef<AirdropComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.buyForm = this.fb.group({
      amount: [null, [Validators.required]],
      address: [null, [Validators.required]]
    });
    this.balance = this.etheriumService.getTokenBalance(environment.deployer).then((res: any) => (res / Math.pow(10, 18)))
  }


  onSubmit(): void {
    if (this.buyForm.valid) {
      const data = this.buyForm.getRawValue()
      this.doAction(data)
    } else {
      this.buyForm.markAllAsTouched()
    }
  }

  doAction(data: Object) {
    this.dialogRef.close({ event: 'send', data: data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'cancel' });
  }


  get f() {
    return this.buyForm?.controls
  }

}
