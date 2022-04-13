import { Injectable } from '@angular/core';
import { addDoc, query, where, Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore'
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userCollection: any;

  constructor(public firestore: Firestore) {
    this.userCollection = collection(this.firestore, 'users')
  }

  checkUserExists(accountNumbe: number): Observable<any> {
    const q = query(this.userCollection, where("user_wallet", "==", accountNumbe));
    return from(getDocs(q))
  }

  registerNewUser(data: any) {
    return from(addDoc(this.userCollection, data)
    )
  }



  // addData(value: any) {
  //   addDoc(this.userCollection, value)
  //     .then(() => {
  //       alert('Data Sent')
  //     })
  //     .catch((err) => {
  //       alert(err.message)
  //     })
  // }

  getData() {
    return getDocs(this.userCollection)
  }

  updateData(id: string) {
    const dataToUpdate = doc(this.firestore, 'users', id);
    updateDoc(dataToUpdate, {
      name: 'Nishant',
      email: 'Nishant123@gmail.com'
    })
      .then(() => {
        alert('Data updated');
        this.getData()
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  deleteData(id: string) {
    const dataToDelete = doc(this.firestore, 'users', id);
    deleteDoc(dataToDelete)
      .then(() => {
        alert('Data Deleted');
        this.getData()
      })
      .catch((err) => {
        alert(err.message)
      })
  }
}
