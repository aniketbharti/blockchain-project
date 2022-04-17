import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-partial-payment-form',
  templateUrl: './partial-payment-form.component.html',
  styleUrls: ['./partial-payment-form.component.scss']
})
export class PartialPaymentFormComponent implements OnInit {

  dataMessage: string = ''
  constructor(public dialogRef: MatDialogRef<PartialPaymentFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onNoClick(): void {
    this.dialogRef.close({ button: 'Cancel' });
  }

  submit(data: string) {
    this.dialogRef.close({ button: 'Ok', data: data });
  }
}

