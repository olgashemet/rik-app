import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { FilterMask } from '../interfaces/filter-mask.interface';
@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private subject: Subject<string | FilterMask | any> = new Subject<string>();

  emit(message: string | FilterMask | any) {
    this.subject.next(message);
  }

  getData(): Observable<string | FilterMask | any> {
    return this.subject.asObservable();
  }
}
