import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent {
  registerForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<RegisterModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(10)]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.min(1111111111), Validators.max(9999999999)]],
      user_wallet: [{ value: data['account'], disabled: true }, [Validators.required]],
      isSeller: [false],
      address: [[]],
      cart: [[]],
      partial_cart: [[]]
    });
  }
  

  onSubmit(): void {
    if (this.registerForm.valid) {
      const data = this.registerForm.getRawValue()
      this.doAction(data)
    } else {
      this.registerForm.markAllAsTouched()
    }
  }

  doAction(data: Object) {
    this.dialogRef.close({ event: 'register', data: data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'cancel' });
  }


  get f() {
    return this.registerForm?.controls
  }

}
