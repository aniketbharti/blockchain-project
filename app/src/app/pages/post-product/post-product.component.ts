import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})
export class PostProductComponent implements OnInit {
  postForm: FormGroup;
  selectedFiles: any[] = [];
  userDetails: any;
  imageError: boolean = false;
  isShipping: any;

  constructor(private snackBar: MatSnackBar, private fb: FormBuilder, private firebaseService: FirebaseService, private dataService: DataService) {
    this.postForm = this.fb.group({
      product_title: [null, [Validators.required]],
      product_category: [null, [Validators.required]],
      product_subcategory: [null, [Validators.required]],
      product_desc: [null, [Validators.required]],
      product_quantity: [{ value: 1, disabled: true }, [Validators.required]],
      price: [null, [Validators.required]],
      partial_payment: ["no", [Validators.required]],
      free_shipping: ["no", [Validators.required]],
      shipping_charges: [0, [Validators.required]],
      accepttc: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      features: this.fb.array([]),
      product_view: [0, []]
    });
    this.isShipping = this.postForm.get("free_shipping")?.value
    this.postForm.get("free_shipping")?.valueChanges.subscribe(selectedValue => {
      console.log('address changed')
      this.isShipping = selectedValue
      console.log(selectedValue)
    })
  }

  uploadFiles(event: any) {
    this.imageError = false
    this.selectedFiles = Array.from(event.target.files)

  }

  removeFile(i: number) {
    this.selectedFiles.splice(i, 1)
  }

  ngOnInit(): void {

    this.features.push(this.addAFeature("Color"))
    this.features.push(this.addAFeature("Replacement Policy"))
    this.dataService.getUserData().subscribe(res => {
      this.userDetails = res
      console.log(res)
    })
  }

  addToArrayFeatures() {
    this.features.push(this.addAFeature())
  }

  addAFeature(name: string | null = null) {
    return this.fb.group({
      name: [name, [Validators.required]],
      value: [null, [Validators.required]],
    })
  }

  removeSkill(i: number) {
    this.features.removeAt(i);
  }

  get features() {
    return this.postForm.get("features") as FormArray
  }

  onSubmit(): void {
    this.imageError = this.selectedFiles.length == 0 ? true : false;
    if (this.postForm.valid && this.selectedFiles.length > 0) {
      this.firebaseService.uploadImage(this.selectedFiles, "image/product", this.userDetails?.id
      ).subscribe((res) => {
        const data = this.postForm.getRawValue()
        data["imagePaths"] = res
        data["user"] = this.userDetails[0].id
        data["wallet"] = this.userDetails[0]?.user_wallet
        data["timestamp"] = Math.floor(Date.now() / 1000)
        this.firebaseService.addProduct(data).subscribe(res => {
          this.postForm.reset()
          this.selectedFiles = []
          this.snackBarMessage("Product Added")
        })
      })
    } else {
      this.postForm.markAllAsTouched()
    }
  }



  get f() {
    return this.postForm?.controls
  }

  snackBarMessage(message: string, action = '') {
    const config = {
      duration: 3000
    }
    return this.snackBar.open(message, action, config);
  }

}
