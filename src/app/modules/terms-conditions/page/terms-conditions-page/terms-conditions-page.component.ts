import { Component, OnInit } from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs";
import {AuthState} from "../../../core/state/auth.state";

@Component({
  templateUrl: './terms-conditions-page.component.html',
  styleUrls: ['./terms-conditions-page.component.scss']
})
export class TermsConditionsPageComponent implements OnInit {
  @Select(AppState.isMobile) isMobile$: Observable<boolean>;

  constructor() { }

  ngOnInit(): void {
  }

}
