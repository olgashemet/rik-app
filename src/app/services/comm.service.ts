import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { FilterMask } from '../interfaces/filter-mask.interface';
@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private subject: Subject<string | any> = new Subject<string>();
  constructor() {}
  public say(message: any) {
    this.subject.next(message);
  }
  public hear(): Observable<string | FilterMask> {
    return this.subject.asObservable();
  }
}
