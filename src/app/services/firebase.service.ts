import { Injectable } from '@angular/core';
import { addDoc, query, where, Firestore, collection, getDocs, doc, updateDoc, deleteDoc, documentId } from '@angular/fire/firestore'
import { from, Observable } from 'rxjs';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userCollection: any;
  productCollection: any
  constructor(public firestore: Firestore, private storage: Storage) {
    this.userCollection = collection(this.firestore, 'users')
    this.productCollection = collection(this.firestore, 'product')
  }

  checkUserExists(accountNumbe: number): Observable<any> {
    const q = query(this.userCollection, where("user_wallet", "==", accountNumbe));
    return from(getDocs(q))
  }

  addProduct(data: any) {
    return from(addDoc(this.productCollection, data))
  }


  uploadImage(image: File[], path: string, userid: string): Observable<string[]> {
    const promises = image.map((file, index) => {
      const storageRef = ref(this.storage, `${path}/${userid}_${file.name}`);
      return uploadBytes(storageRef, file).then((result) => getDownloadURL(result.ref))
    })
    return from(Promise.all(promises))
  }

  registerNewUser(data: any) {
    return from(addDoc(this.userCollection, data))
  }

  searchProduct() {
    return from(getDocs(this.productCollection))
  }

  searchProductOnCondition(field: string, value: string) {
    const q = query(this.productCollection, where(field, "==", value));
    return from(getDocs(q))
  }

  searchSpecificProduct(id: string) {
    const q = query(this.productCollection, where(documentId(), '==', id))
    return from(getDocs(q))
  }

  similarProduct(field: string) {
    const q = query(this.productCollection, where("product_subcategory", '==', field))
    return from(getDocs(q))
  }

  // getData() {
  //   return getDocs(this.userCollection)
  // }

  // updateData(id: string) {
  //   const dataToUpdate = doc(this.firestore, 'users', id);
  //   updateDoc(dataToUpdate, {
  //     name: 'Nishant',
  //     email: 'Nishant123@gmail.com'
  //   })
  //     .then(() => {
  //       alert('Data updated');
  //       this.getData()
  //     })
  //     .catch((err) => {
  //       alert(err.message)
  //     })
  // }

  // deleteData(id: string) {
  //   const dataToDelete = doc(this.firestore, 'users', id);
  //   deleteDoc(dataToDelete)
  //     .then(() => {
  //       alert('Data Deleted');
  //       this.getData()
  //     })
  //     .catch((err) => {
  //       alert(err.message)
  //     })
  // }
}
