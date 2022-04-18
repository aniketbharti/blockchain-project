import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userDataSubject: BehaviorSubject<any>;

  constructor() {
    const localstorage = localStorage.getItem("userData")
    const data = localstorage ? JSON.parse(localstorage) : null
    this.userDataSubject = new BehaviorSubject<any>(data)
  }

  getUserData() {
    return this.userDataSubject.asObservable()
  }

  setUserData(data: Object) {
    console.log(data)
    localStorage.setItem("userData", JSON.stringify(data))
    this.userDataSubject.next(data)
  }

  logout() {
    localStorage.clear()
    this.userDataSubject.next(null)
  }

}
