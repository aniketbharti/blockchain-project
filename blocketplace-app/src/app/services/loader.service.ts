import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loaderSubject: Subject<boolean> | null = null
  constructor() {
    this.loaderSubject = new Subject()
  }
  changeLoaderState(showLoader: boolean) {
    this.loaderSubject?.next(showLoader)
  }
  loaderListener(): Observable<boolean> | undefined {
    return this.loaderSubject?.asObservable()
  }
}
