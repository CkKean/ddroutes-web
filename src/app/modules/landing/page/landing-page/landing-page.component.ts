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
  bannerImg1: string = './assets/img/banner/banner.jpg'
  bannerImg2: string = './assets/img/landing_1.jpg'
  bannerImg3: string = './assets/img/landing_2.jpg'

  array = [this.bannerImg1, this.bannerImg2, this.bannerImg3];

  constructor() {
  }

  ngOnInit() {
  }

  get ImagePath(): string {
    return './assets/img/';
  }


}
