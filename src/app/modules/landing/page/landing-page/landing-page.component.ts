import {Component, OnInit} from '@angular/core';
import {AppState} from "../../../core/state/app.state";
import {Observable} from "rxjs/internal/Observable";
import {Select} from "@ngxs/store";

@Component({
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  @Select(AppState.isMobile) isMobile$: Observable<boolean>;
  bannerImg: string = './assets/img/banner/banner.png'

  array = [1, 2];

  constructor() {
  }

  ngOnInit() {
  }

  get ImagePath(): string {
    return './assets/img/';
  }


}
