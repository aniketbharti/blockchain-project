import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService, private dataService: DataService) {
    this.postForm = this.fb.group({
      product_title: [null, [Validators.required]],
      product_category: [null, [Validators.required]],
      product_subcategory: [null, [Validators.required]],
      product_desc: [null, [Validators.required]],
      product_quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      partial_payment: ["no", [Validators.required]],
      free_shipping: ["no", [Validators.required]],
      shipping_charges: [0, [Validators.required]],
      accepttc: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      features: this.fb.array([]),
      product_view: [0, []]
    });
  }

  uploadFiles(event: any) {
    this.selectedFiles = Array.from(event.target.files)

  }

  removeFile(i: number) {
    this.selectedFiles.splice(i, 1)
  }

  ngOnInit(): void {

    this.features.push(this.addAFeature("Color"))
    this.features.push(this.addAFeature("Condition"))
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
    if (this.postForm.valid) {
      this.firebaseService.uploadImage(this.selectedFiles, "image/product", this.userDetails?.id
      ).subscribe((res) => {
        const data = this.postForm.getRawValue()
        data["imagePaths"] = res
        data["user"] = this.userDetails[0].id
        this.firebaseService.addProduct(data).subscribe(res => {
          this.postForm.reset()
        })
      })
    } else {
      this.postForm.markAllAsTouched()
    }
  }



  get f() {
    return this.postForm?.controls
  }


}
