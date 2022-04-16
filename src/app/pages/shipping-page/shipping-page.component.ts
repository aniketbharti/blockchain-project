import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-shipping-page',
  templateUrl: './shipping-page.component.html',
  styleUrls: ['./shipping-page.component.scss']
})
export class ShippingPageComponent implements OnInit {
  shippingForm: FormGroup;
  userData: any;
  results: any;
  address: any;

  constructor(private snackBar: MatSnackBar, private router: Router, private fb: FormBuilder, private firebaseService: FirebaseService, private dataService: DataService) {
    this.shippingForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(10)]],
      addr1: [null, [Validators.required]],
      addr2: [null],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      zip: [null, [Validators.required]],
      country: ["United States", [Validators.required]]
    });
    this.dataService.getUserData().subscribe((res) => {
      this.userData = res
    })

  }

  ngOnInit(): void {
    this.firebaseService.checkUserExists(this.userData[0].user_wallet).subscribe((res) => {
      this.results = res.docs.map((docs: any) => {
        return { id: docs.id, ...docs.data() }
      })[0]
    })
  }

  get f() {
    return this.shippingForm?.controls
  }

  submitForm() {
    if (this.shippingForm.valid) {
      const data = this.shippingForm.getRawValue()
      this.results.address.push(data)
      this.firebaseService.updateUserData(this.userData[0].id, this.results).subscribe((res) => {
        this.snackBarMessage("Address Added Successfully")
        this.router.navigate([`/review-cart`]);
      })

    } else {
      this.shippingForm.markAllAsTouched()
    }
  }
  snackBarMessage(message: string, action = '', config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }
}
