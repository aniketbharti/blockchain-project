import { Injectable } from '@angular/core';
import { addDoc, query, where, Firestore, collection, getDocs, doc, updateDoc, deleteDoc, documentId, limit, orderBy } from '@angular/fire/firestore'
import { from, Observable } from 'rxjs';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userCollection: any;
  productCollection: any;
  orderCollection: any;
  constructor(public firestore: Firestore, private storage: Storage) {
    this.userCollection = collection(this.firestore, 'users')
    this.productCollection = collection(this.firestore, 'product')
    this.orderCollection = collection(this.firestore, 'orders')
  }

  checkUserExists(accountNumber: number): Observable<any> {
    const q = query(this.userCollection, where("user_wallet", "==", accountNumber));
    return from(getDocs(q))
  }

  addProduct(data: any) {
    return from(addDoc(this.productCollection, data))
  }

  placeOrder(data: any) {
    return from(addDoc(this.orderCollection, data))
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

  searchSpecificOrder(id: string) {
    const q = query(this.orderCollection, where(documentId(), '==', id))
    return from(getDocs(q))
  }

  similarProduct(field: string) {
    const q = query(this.productCollection, where("product_subcategory", '==', field))
    return from(getDocs(q))
  }

  updateUserData(id: string, data: any) {
    const dataToUpdate = doc(this.firestore, 'users', id);
    return from(updateDoc(dataToUpdate, data))
  }

  updateOrder(id: string, data: any) {
    const dataToUpdate = doc(this.firestore, 'orders', id);
    return from(updateDoc(dataToUpdate, data))
  }

  getTrendyProducts() {
    const q = query(this.productCollection, orderBy("product_view"), limit(6));
    return from(getDocs(q))
  }

  getMyProduct(data: string) {
    const q = query(this.productCollection, where("user", '==', data));
    return from(getDocs(q))
  }


  getMyOrders(data: string) {
    const q = query(this.orderCollection, where("userId", '==', data));
    return from(getDocs(q))
  }



  deleteData(id: string) {
    const dataToDelete = doc(this.firestore, 'product', id);
    return from(deleteDoc(dataToDelete))
  }
}
