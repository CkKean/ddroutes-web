import {Component, OnInit} from '@angular/core';
import {AppState} from "../../state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {Select} from "@ngxs/store";

@Component({
  templateUrl: './postlogin-layout.component.html',
  styleUrls: ['./postlogin-layout.component.scss']
})
export class PostloginLayoutComponent implements OnInit {

  isCollapsed: boolean = false;

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  constructor() {
  }

  ngOnInit(): void {
  }

  getCollapsedEvent(isCollapsed: boolean): void {
    this.isCollapsed = isCollapsed;
  }
}
