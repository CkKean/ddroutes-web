import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.scss']
})
export class BaseComponent implements OnDestroy, OnInit {
  readonly onDestroySubject: Subject<boolean> = new Subject();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }
}
