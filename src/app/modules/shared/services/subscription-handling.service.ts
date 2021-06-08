import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, from } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Injectable()
export class SubHandlingService implements OnDestroy {
  readonly onDestroySubject: Subject<boolean> = new Subject();

  subscribe(o: Observable<any>): void {
    o.pipe(takeUntil(this.onDestroySubject)).subscribe();
  }

  once(o: Observable<any>, ret?: boolean): Observable<any> | null {
    if (ret) {
      return o.pipe(take(1));
    }

    this.subscribe(o.pipe(take(1)));
  }

  chain(o: Observable<any>): Observable<any> {
    return o.pipe(takeUntil(this.onDestroySubject));
  }

  fromPromise(...promises): Observable<any> {
    return from(Promise.all([...promises])).pipe(takeUntil(this.onDestroySubject));
  }

  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }
}
